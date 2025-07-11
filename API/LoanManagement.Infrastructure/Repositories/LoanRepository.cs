using Dapper;
using LoanManagement.Core.DTOs;
using LoanManagement.Core.Entities;
using LoanManagement.Core.Exceptions;
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
    public class LoanRepository : ILoanRepository
    {
        private readonly string _connectionString;
        public LoanRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public async Task<IEnumerable<Loan>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var sql = @"SELECT * FROM CoreLoan.Loans";

            var loans = await connection.QueryAsync<Loan>(sql);
            return loans;
        }

        public async Task<decimal?> GetLoanBalanceAsync(int loanId)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var sql = "SELECT CurrentBalance FROM CoreLoan.Loans WHERE LoanID = @LoanID";

            var result = await connection.QuerySingleOrDefaultAsync<decimal?>(sql, new { LoanID = loanId });

            if (result is null)
            {
                throw new NotFoundException($"Loan with ID {loanId} not found.");
            }
            return result;
        }

        public async Task<int> InsertApplicationAsync(LoanApplication loanApplication)
        {
            const string sql = @"
            INSERT INTO LoanApp.LoanApplications
            (CustomerId, LoanProductId, AssignedEmployeeID, RequestedAmount, ApplicationStatus, ApplicationDate)
            OUTPUT INSERTED.ApplicationID
            VALUES (@CustomerId, @LoanProductId, @AssignedEmployeeID, @RequestedAmount, @ApplicationStatus, @ApplicationDate);";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var newId = await connection.ExecuteScalarAsync<int>(sql, loanApplication);
            if (newId <= 0)
            {
                throw new Exception("Failed to submit loan application.");
            }
            return newId;
        }

        public async Task<LoanApplication> GetLoanApplication(int loanApplicationId)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var sql = "SELECT * FROM LoanApp.LoanApplications WHERE ApplicationID = @LoanApplicationId";

            var result = await connection.QuerySingleOrDefaultAsync<LoanApplication>(sql, new { LoanApplicationId = loanApplicationId });

            if (result is null)
            {
                throw new NotFoundException($"Loan Application with ID {loanApplicationId} not found.");
            }
            return result;
        }
    }
}
