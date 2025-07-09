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
    public class PaymentRepository : IPaymentRepository
    {
        private readonly string _connectionString;

        public PaymentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public async Task<int> InsertPaymentAsync(Payment payment)
        {
            const string sql = @"
            INSERT INTO CoreLoan.Payments (LoanId, PaymentAmount, PaymentDate)
            OUTPUT INSERTED.PaymentId
                VALUES (@LoanId, @PaymentAmount, @PaymentDate);";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var newId = await connection.ExecuteScalarAsync<int>(sql, payment);
            if (newId <= 0)
            {
                throw new Exception("Failed to submit Payment.");
            }
            return newId;
        }
    }
}
