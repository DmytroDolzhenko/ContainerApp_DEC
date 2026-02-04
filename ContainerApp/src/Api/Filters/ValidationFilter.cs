using Application.Common.Exceptions;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.ComponentModel.DataAnnotations;

namespace Api.Filters
{
    public class ValidationFilter(IServiceProvider serviceProvider) : IAsyncActionFilter
    {
        public class ApiExceptionFilterAttribute : ExceptionFilterAttribute
        {
            public override void OnException(ExceptionContext context)
            {
                if (context.Exception is NotFoundException notFoundException)
                {
                    HandleNotFoundException(context, notFoundException);
                }
                else
                {
                    base.OnException(context);
                }
            }

            private void HandleNotFoundException(ExceptionContext context, NotFoundException exception)
            {
                var details = new ProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                    Title = "The specified resource was not found.",
                    Status = StatusCodes.Status404NotFound,
                    Detail = exception.Message
                };

                context.Result = new NotFoundObjectResult(details);
                context.ExceptionHandled = true;
            }
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            foreach (var argument in context.ActionArguments)
            {
                if (argument.Value == null)
                {
                    continue;
                }

                var argumentType = argument.Value.GetType();
                var validatorType = typeof(IValidator<>).MakeGenericType(argumentType);

                if (serviceProvider.GetService(validatorType) is IValidator validator)
                {
                    var validationContext = new ValidationContext<object>(argument.Value);
                    var validationResult = await validator.ValidateAsync(validationContext);

                    if (!validationResult.IsValid)
                    {
                        var errors = validationResult.Errors
                            .GroupBy(x => x.PropertyName)
                            .ToDictionary(
                                g => g.Key,
                                g => g.Select(x => x.ErrorMessage).ToArray());

                        context.Result = new BadRequestObjectResult(
                            new ValidationProblemDetails
                            {
                                Errors = errors,
                                Title = "Validation Failed",
                                Detail = "One or more validation errors occurred.",
                                Status = 400
                            });

                        return;
                    }
                }
            }

            await next();
        }
    }
}
