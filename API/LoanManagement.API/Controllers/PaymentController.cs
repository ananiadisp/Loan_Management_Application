using LoanManagement.Core.DTOs;
using LoanManagement.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LoanManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitPayment([FromBody] CreatePaymentDto createPaymentDto)
        {
            var payment = await _paymentService.SubmitPayment(createPaymentDto);
            return Ok(payment);
        }
    }
}
