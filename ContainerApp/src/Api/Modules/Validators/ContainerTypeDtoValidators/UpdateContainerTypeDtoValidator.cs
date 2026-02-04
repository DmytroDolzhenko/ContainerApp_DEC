using Api.Dtos;
using FluentValidation;

namespace Api.Modules.Validators.ContainerTypeDtoValidators
{
    public class UpdateContainerTypeDtoValidator : AbstractValidator<UpdateContainerTypeDto>
    {
        public UpdateContainerTypeDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Container Type Name is required.")
                .MaximumLength(50).WithMessage("Container Type Name must not exceed 50 characters.");
        }
    }
}
