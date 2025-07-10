using Dapper;
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
    }
}
