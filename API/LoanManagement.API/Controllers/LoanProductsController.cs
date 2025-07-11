using LoanManagement.Application.Services;
using LoanManagement.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LoanManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoanProductsController : ControllerBase
    {
        private readonly ILoanProductService _loanProductService;

        public LoanProductsController(ILoanProductService loanProductService)
        {
            _loanProductService = loanProductService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLoanProducts()
        {
            var loanProducts = await _loanProductService.GetAllAsync();
            return Ok(loanProducts);
        }
    }
}
