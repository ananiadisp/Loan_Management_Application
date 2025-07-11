using Dapper;
using LoanManagement.Core.Entities;
using LoanManagement.Core.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Infrastructure.Repositories
{
    public class LoanProductRepository : ILoanProductRepository
    {
        private readonly string _connectionString;
        public LoanProductRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public async Task<IEnumerable<LoanProduct>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var sql = @"SELECT * FROM Reference.LoanProducts";

            var loans = await connection.QueryAsync<LoanProduct>(sql);
            return loans;
        }
    }
}
