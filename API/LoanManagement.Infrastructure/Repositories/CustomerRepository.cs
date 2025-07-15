using Dapper;
using LoanManagement.Core.DTOs;
using LoanManagement.Core.Entities;
using LoanManagement.Core.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace LoanManagement.Infrastructure.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly string _connectionString;
        public CustomerRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public async Task<IEnumerable<Customer>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var sql = @"SELECT * FROM CoreLoan.Customers";

            var loans = await connection.QueryAsync<Customer>(sql);
            return loans;
        }

        public async Task<CustomerDto?> GetCustomer(int customerId)
        {
            const string sql = @"
                SELECT 
                    c.CustomerID AS Id,
                    c.FirstName,
                    c.LastName,
                    c.RegistrationDate,
                    l.LoanID AS LoanId,
                    l.CustomerID,
                    l.ApprovedAmount
                FROM CoreLoan.Customers c
                LEFT JOIN CoreLoan.Loans l ON c.CustomerID = l.CustomerID
                WHERE c.CustomerID = @CustomerId";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var customerMap = new Dictionary<int, CustomerDto>();

            var result = await connection.QueryAsync<CustomerDto, LoanDto, CustomerDto>(
                sql,
                (customer, loan) =>
                {
                    if (!customerMap.TryGetValue(customer.Id, out var existingCustomer))
                    {
                        existingCustomer = customer;
                        existingCustomer.Loans = new List<LoanDto>();
                        customerMap.Add(existingCustomer.Id, existingCustomer);
                    }

                    if (loan != null && loan.LoanId != 0)
                    {
                        existingCustomer.Loans.Add(loan);
                    }
                    return existingCustomer;
                },
                new { CustomerId = customerId },
                splitOn: "LoanId"
            );

            return customerMap.Values.FirstOrDefault();
        }
    }
}
