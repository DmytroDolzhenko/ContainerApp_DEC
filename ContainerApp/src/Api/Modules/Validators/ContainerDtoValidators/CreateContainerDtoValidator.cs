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
            RuleFor(x => x.Description)
                .MaximumLength(150).WithMessage("Description must not exceed 150 characters.");
            RuleFor(x => x.ContainerTypeId)
                .NotEmpty().WithMessage("Container Type Id is required.");
        }
    }
}
