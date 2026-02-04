using Api.Dtos;
using FluentValidation;

namespace Api.Modules.Validators.ContainerDtoValidators
{
    public class FillContainerDtoValidator : AbstractValidator<FillContainerDto>
    {
        public FillContainerDtoValidator()
        {
            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product Id is required.");
            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Amount must be greater than zero.");
        }
    }
}
