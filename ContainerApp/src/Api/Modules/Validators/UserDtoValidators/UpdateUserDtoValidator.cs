using Api.Dtos;
using FluentValidation;

namespace Api.Modules.Validators.UserDtoValidators
{
    public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDto>
    {
        public UpdateUserDtoValidator()
        {

            RuleFor(x => x.Name)
                .NotEmpty()
                .MinimumLength(2);

            RuleFor(x => x.Surname)
                .NotEmpty()
                .MinimumLength(2);

            RuleFor(x => x.Middlename)
                .NotEmpty()
                .MinimumLength(2);

            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress().WithMessage("Невірний формат Email адреси")
                .MaximumLength(255);
        }
    }
}
