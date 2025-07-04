using LoanManagement.Core.Interfaces;
using LoanManagement.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace LoanManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoansController : ControllerBase
    {
        private readonly ILoanService _loanService;

        public LoansController(ILoanService loanService)
        {
            _loanService = loanService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLoans()
        {
            var loans = await _loanService.GetAllAsync();
            return Ok(loans);
        }

        [HttpGet("{id}/balance")]
        public async Task<IActionResult> GetLoanBalance(int id)
        {
            var balance = await _loanService.GetLoanBalanceAsync(id);
            return Ok(balance);
        }
    }
}
