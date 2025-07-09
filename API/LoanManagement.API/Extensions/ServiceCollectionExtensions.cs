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
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();

            services.AddScoped<ILoanService, LoanService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IPaymentService, PaymentService>();
            return services;
        }
    }
}
