using Api.Dtos;
using FluentValidation;

namespace Api.Modules.Validators.ContainerDtoValidators
{
    public class CreateContainerDtoValidator : AbstractValidator<CreateContainerDto>
    {
        public CreateContainerDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(30).WithMessage("Name must not exceed 30 characters.");
           /* RuleFor(x => x.Capacity)
                .GreaterThan(0).WithMessage("Capacity must be greater than zero.");*/
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(150).WithMessage("Description must not exceed 150 characters.");
            RuleFor(x => x.ContainerTypeId)
                .NotEmpty().WithMessage("Container Type Id is required.");
        }
    }
}
