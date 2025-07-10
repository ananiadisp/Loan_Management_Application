using LoanManagement.Core.DTOs;
using LoanManagement.Core.Entities;
using LoanManagement.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Application.Services
{
    public class LoanService : ILoanService
    {
        private readonly ILoanRepository _loanRepository;
        public LoanService(ILoanRepository loanRepository)
        {
            _loanRepository = loanRepository;
        }

        public async Task<IEnumerable<Loan>> GetAllAsync()
        {
            return await _loanRepository.GetAllAsync();
        }

        public async Task<decimal?> GetLoanBalanceAsync(int loanId)
        {
            return await _loanRepository.GetLoanBalanceAsync(loanId);
        }

        public async Task<int> SubmitLoanApplication(CreateLoanApplicationDto createLoanApplicationDto)
        {
            LoanApplication loanApplication = new()
            {
                CustomerID = createLoanApplicationDto.CustomerId,
                LoanProductID = createLoanApplicationDto.LoanProductId,
                RequestedAmount = createLoanApplicationDto.RequestedAmount,
                ApplicationStatus = "Approved",
                ApplicationDate = DateTime.UtcNow
            };

            return await _loanRepository.InsertApplicationAsync(loanApplication);
        }

        public async Task<LoanApplication> GetLoanApplication(int loanApplicationId)
        {
            return await _loanRepository.GetLoanApplication(loanApplicationId);
        }
    }
}
