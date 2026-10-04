using System.Text;
using CreatorFi.Data;
using CreatorFi.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<CreatorFiDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CreatorFi")));
builder.Services.AddScoped<SnapshotReader>();
builder.Services.AddScoped<WorkspaceService>();
builder.Services.AddScoped<CreatorService>();
builder.Services.AddScoped<AuthService>();

var signingKey = builder.Configuration["Auth:SigningKey"] ?? "";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Auth:Issuer"],
            ValidAudience = builder.Configuration["Auth:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("web", policy =>
        policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("web");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var database = scope.ServiceProvider.GetRequiredService<CreatorFiDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("CreatorFi");
    try
    {
        database.Database.Migrate();
        DbSeeder.Seed(database);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Could not migrate or seed CreatorFi. Update ConnectionStrings:CreatorFi in appsettings.json to match the SQL Server instance you open in SSMS.");
        throw;
    }
}

app.Run();
