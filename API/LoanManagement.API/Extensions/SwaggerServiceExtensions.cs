using Microsoft.OpenApi.Models;

namespace LoanManagement.API.Extensions
{
    public static class SwaggerServiceExtensions
    {
        public static IServiceCollection AddSwaggerApi(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Loan Management API",
                    Version = "v1",
                    Description = "API documentation for the Loan Management System"
                });
            });

            return services;
        }

        public static WebApplication MapOpenApi(this WebApplication app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Loan Management API v1");
                options.RoutePrefix = string.Empty; // Swagger UI at root `/`
            });

            return app;
        }
    }
}
