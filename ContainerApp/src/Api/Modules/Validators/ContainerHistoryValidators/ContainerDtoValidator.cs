using Api.Dtos;
using FluentValidation;

namespace Api.Modules.Validators.ContainerHistoryValidators
{
    public class ContainerDtoValidator : AbstractValidator<ContainerHistoryDto>
    {
        public ContainerDtoValidator()
        {
                RuleFor(x => x.ContainerId)
                    .GreaterThan(0).WithMessage("Container Id must be greater than zero.");
                RuleFor(x => x.Action)
                    .NotEmpty().WithMessage("Action is required.")
                    .MaximumLength(50).WithMessage("Action must not exceed 50 characters.");
                RuleFor(x => x.UserId)
                    .GreaterThan(0).WithMessage("User Id must be greater than zero.");
        }
    }
}
