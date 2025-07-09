using FluentValidation;

namespace LoanManagement.API.Validators
{
    public class ValidatorException : Exception
    {
        public List<ValidationError> Errors { get; }

        public ValidatorException(IEnumerable<FluentValidation.Results.ValidationFailure> failures)
        {
            Errors = failures
                .Where(e => !string.IsNullOrWhiteSpace(e.ErrorMessage))
                .Select(e => new ValidationError(e.ErrorCode, e.ErrorMessage))
                .ToList();
        }
    }

    public class ValidationError
    {
        public string Code { get; }
        public string Description { get; }

        public ValidationError(string code, string description)
        {
            Code = code;
            Description = description;
        }
    }

    public static class ValidatorExtensions
    {
        public static void ValidateOrThrow<T>(this IValidator<T> validator, T instance)
        {
            var result = validator.Validate(instance);
            if (!result.IsValid)
                throw new ValidatorException(result.Errors);
        }
    }
}
