using LoanManagement.Core.DTOs;
using LoanManagement.Core.Interfaces;
using LoanManagement.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManagement.Application.Services
{
    public class LoanProductService : ILoanProductService
    {
        private readonly ILoanProductRepository _loanProductRepository;

        public LoanProductService(ILoanProductRepository loanProductRepository)
        {
            _loanProductRepository = loanProductRepository;
        }

        public async Task<IEnumerable<LoanProductDto>> GetAllAsync()
        {
            var loanProducts = await _loanProductRepository.GetAllAsync();

            return loanProducts.Select(e => new LoanProductDto
            {
                LoanProductID = e.LoanProductID,
                ProductName = e.ProductName
            });
        }
    }
}
