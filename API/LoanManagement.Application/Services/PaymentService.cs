using LoanManagement.Core.DTOs;
using LoanManagement.Core.Entities;
using LoanManagement.Core.Interfaces;

namespace LoanManagement.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        public PaymentService(IPaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }
        public async Task<int> SubmitPayment(CreatePaymentDto createPaymentDto)
        {
            Payment payment = new()
            {
                LoanID = createPaymentDto.LoanId,
                PaymentAmount = createPaymentDto.Amount,
                PaymentDate = DateTime.UtcNow
            };

            return await _paymentRepository.InsertPaymentAsync(payment);
        }
    }
}
