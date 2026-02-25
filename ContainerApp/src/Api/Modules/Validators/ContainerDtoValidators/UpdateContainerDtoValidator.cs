using Api.Dtos;
using FluentValidation;

namespace Api.Modules.Validators.ContainerDtoValidators
{
    public class UpdateContainerDtoValidator : AbstractValidator<UpdateContainerDto>
    {
        public UpdateContainerDtoValidator()
        {
            RuleFor(x => x.Description).MaximumLength(150);
            RuleFor(x => x.Name).NotEmpty().MaximumLength(30);
        }
    }
}
