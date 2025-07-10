using FluentValidation;
using LoanManagement.Core.DTOs;

namespace LoanManagement.API.Validators
{
    public class CreatePaymentDtoValidator : AbstractValidator<CreatePaymentDto>
    {
        public CreatePaymentDtoValidator()
        {
            RuleFor(x => x.LoanId)
                .NotEmpty()
                .WithErrorCode("LoanId")
                .WithMessage("Loan ID is required.");
                
            RuleFor(x => x.Amount)
                .GreaterThan(0)
                .WithErrorCode("Amount")
                .WithMessage("Payment amount must be greater than 0.");
                
            RuleFor(x => x.PaymentDate)
                .NotEmpty()
                .WithErrorCode("PaymentDate")
                .WithMessage("Payment date is required.");
        }
    }
}
