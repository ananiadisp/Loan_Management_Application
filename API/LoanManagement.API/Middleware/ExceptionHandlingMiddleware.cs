using LoanManagement.API.Validators;
using LoanManagement.Core.Exceptions;
using System.Net;
using System.Text.Json;

namespace LoanManagement.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ValidatorException ex)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                context.Response.ContentType = "application/json";

                var response = JsonSerializer.Serialize(ex.Errors);
                await context.Response.WriteAsync(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");

                var response = context.Response;
                response.ContentType = "application/json";

                var statusCode = ex switch
                {
                    NotFoundException => HttpStatusCode.NotFound,
                    System.ComponentModel.DataAnnotations.ValidationException => HttpStatusCode.BadRequest,
                    _ => HttpStatusCode.InternalServerError
                };

                var errorResponse = new
                {
                    StatusCode = (int)statusCode,
                    Message = ex.Message
                };

                response.StatusCode = (int)statusCode;

                var json = JsonSerializer.Serialize(errorResponse);
                await response.WriteAsync(json);
            }
        }
    }
}
