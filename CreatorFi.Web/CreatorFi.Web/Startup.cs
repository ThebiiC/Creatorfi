using CreatorFi.Web.Middleware;
using Microsoft.AspNetCore.SpaServices.AngularCli;

namespace CreatorFi.Web;

public class Startup(IConfiguration configuration)
{
    public IConfiguration Configuration { get; } = configuration;

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllersWithViews();
        services.AddHttpClient(ApiProxyMiddleware.ClientName, client =>
        {
            var address = Configuration["CreatorFiApi"] ?? "http://localhost:5220";
            client.BaseAddress = new Uri(address.TrimEnd('/') + "/");
        });
        services.AddSpaStaticFiles(spa =>
        {
            spa.RootPath = "ClientApp/dist/creatorfi-web/browser";
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseMiddleware<ApiProxyMiddleware>();
        app.UseStaticFiles();
        if (!env.IsDevelopment())
        {
            app.UseSpaStaticFiles();
        }

        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");
        });

        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "ClientApp";

            if (env.IsDevelopment())
            {
                spa.UseAngularCliServer(npmScript: "start:spa");
            }
        });
    }
}
