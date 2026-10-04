using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using CreatorFi.Data;
using CreatorFi.API.Infrastructure;
using CreatorFi.Common.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CreatorFi.API.Services;

public class AuthService(CreatorFiDbContext db, IConfiguration config)
{
    public const string ManagerRole = "Manager";

    public async Task<ServiceResult<AuthResponse>> RegisterAsync(RegisterRequest request, CancellationToken ct)
    {
        var name = request.Name.Trim();
        var email = request.Email.Trim().ToLowerInvariant();
        var password = request.Password ?? "";
        if (name.Length == 0 || email.Length == 0 || password.Length == 0)
        {
            return ServiceResult<AuthResponse>.Fail("Missing details", "Name, email, and password are required.");
        }

        if (!IsEmail(email))
        {
            return ServiceResult<AuthResponse>.Fail("Check the email", "Enter a valid email address.");
        }

        if (password.Length < 8)
        {
            return ServiceResult<AuthResponse>.Fail("Password too short", "Use at least 8 characters.");
        }

        var taken = await db.UserAccounts.AnyAsync(account => account.Email == email, ct);
        if (taken)
        {
            return ServiceResult<AuthResponse>.Fail("Email already used", "An account with that email already exists.");
        }

        var now = DateTime.UtcNow;
        var account = new UserAccount
        {
            Name = name,
            Email = email,
            Handle = "",
            Avatar = TextFormats.Initials(name),
            Location = "",
            Plan = "",
            IdReference = "",
            IdVerified = false,
            Role = ManagerRole,
            PasswordHash = PasswordHasher.Hash(password),
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.UserAccounts.Add(account);
        await db.SaveChangesAsync(ct);
        return ServiceResult<AuthResponse>.Success(Issue(account));
    }

    public async Task<ServiceResult<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var password = request.Password ?? "";
        if (email.Length == 0 || password.Length == 0)
        {
            return ServiceResult<AuthResponse>.Fail("Missing details", "Email and password are required.");
        }

        var account = await db.UserAccounts.FirstOrDefaultAsync(item => item.Email == email, ct);
        if (account is null || !PasswordHasher.Verify(password, account.PasswordHash))
        {
            return ServiceResult<AuthResponse>.Fail("Sign-in failed", "Email or password is incorrect.");
        }

        if (account.Role != ManagerRole)
        {
            return ServiceResult<AuthResponse>.Fail("Manager sign-in only", "Creator sign-in is not open yet.");
        }

        return ServiceResult<AuthResponse>.Success(Issue(account));
    }

    private AuthResponse Issue(UserAccount account)
    {
        var key = config["Auth:SigningKey"] ?? throw new InvalidOperationException("Auth:SigningKey is missing.");
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(12);
        var token = new JwtSecurityToken(
            issuer: config["Auth:Issuer"],
            audience: config["Auth:Audience"],
            claims:
            [
                new Claim(JwtRegisteredClaimNames.Sub, account.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, account.Email),
                new Claim(ClaimTypes.Name, account.Name),
                new Claim(ClaimTypes.Role, account.Role),
            ],
            expires: expires,
            signingCredentials: credentials);
        return new AuthResponse(new JwtSecurityTokenHandler().WriteToken(token), account.Name, account.Email, account.Role);
    }

    private static bool IsEmail(string email) =>
        MailAddress.TryCreate(email, out var parsed) && parsed.Address.Equals(email, StringComparison.OrdinalIgnoreCase);
}
