using Api.Dtos;
using FluentValidation;

namespace Api.Modules.Validators.ContainerTypeDtoValidators
{
    public class CreateContainerTypeDtoValidator : AbstractValidator<CreateContainerTypeDto>
    {
        public CreateContainerTypeDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Type Name is required.")
                .MaximumLength(50).WithMessage("Type Name must not exceed 50 characters.");
        }
    }
}
