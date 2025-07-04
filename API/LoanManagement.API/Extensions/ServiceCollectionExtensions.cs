using LoanManagement.Application.Services;
using LoanManagement.Core.Interfaces;
using LoanManagement.Infrastructure.Repositories;

namespace LoanManagement.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<ILoanRepository, LoanRepository>();
            services.AddScoped<ILoanService, LoanService>();
            return services;
        }
    }
}
