using FluentValidation;
using LoanManagement.Core.DTOs;
using LoanManagement.Core.Entities;

namespace LoanManagement.API.Validators
{
    public class CreateLoanApplicationDtoValidator : AbstractValidator<CreateLoanApplicationDto>
    {
        public CreateLoanApplicationDtoValidator()
        {
            RuleFor(x => x.CustomerId)
                .NotEmpty()
                .WithErrorCode("CustomerId")
                .WithMessage("Customer ID is required.");
            RuleFor(x => x.LoanProductId)
                .NotEmpty()
                .WithErrorCode("LoanProductId")
                .WithMessage("Loan Product ID is required.");
            RuleFor(x => x.RequestedAmount)
                .GreaterThan(0)
                .WithErrorCode("RequestedAmount")
                .WithMessage("Requested Amount must be greater than 0.");
        }
    }
}
