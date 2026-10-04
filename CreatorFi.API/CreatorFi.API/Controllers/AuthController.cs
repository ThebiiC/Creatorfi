using CreatorFi.Common.Models;
using CreatorFi.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace CreatorFi.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AuthService auth) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request, CancellationToken ct) =>
        From(await auth.RegisterAsync(request, ct));

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken ct) =>
        From(await auth.LoginAsync(request, ct));

    private static IActionResult From(ServiceResult<AuthResponse> result)
    {
        if (!result.IsSuccess || result.Value is null)
        {
            return new BadRequestObjectResult(new ApiMessage(
                result.ErrorTitle ?? "Request failed",
                result.ErrorMessage ?? "The API could not sign you in."));
        }

        return new OkObjectResult(result.Value);
    }
}
