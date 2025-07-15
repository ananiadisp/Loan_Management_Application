using FluentValidation;
using LoanManagement.API.Validators;
using LoanManagement.Core.DTOs;
using LoanManagement.Core.Interfaces;
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

        [HttpPost]
        public async Task<IActionResult> SubmitLoanApplication([FromBody] CreateLoanApplicationDto createLoanApplicationDto)
        {
            new CreateLoanApplicationDtoValidator().ValidateOrThrow(createLoanApplicationDto);

            var id = await _loanService.SubmitLoanApplication(createLoanApplicationDto);
            return CreatedAtAction(nameof(GetApplicationById), new { id = id }, id);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetApplicationById(int id)
        {
            var loanApplication = await _loanService.GetLoanApplication(id);
            if (loanApplication == null)
                return NotFound();

            return Ok(loanApplication);
        }

        [HttpGet("{id}/loan")]
        public async Task<IActionResult> GetLoan(int id)
        {
            var loan = await _loanService.GetLoan(id);
            if (loan == null)
                return NotFound();

            return Ok(loan);
        }
    }
}
