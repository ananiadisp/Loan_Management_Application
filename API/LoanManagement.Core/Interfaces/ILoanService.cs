﻿using LoanManagement.Core.DTOs;
using LoanManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Core.Interfaces
{
    public interface ILoanService
    {
        Task<IEnumerable<Loan>> GetAllAsync();
        Task<decimal?> GetLoanBalanceAsync(int loanId);
        Task<int> SubmitLoanApplication(CreateLoanApplicationDto createLoanApplicationDto);
        Task<LoanApplication> GetLoanApplication(int loanApplicationId);
        Task<Loan> GetLoan(int loanId);

    }
}
