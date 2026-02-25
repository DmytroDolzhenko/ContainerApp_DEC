using Api.Dtos;
using FluentValidation;

namespace Api.Modules.Validators.ProductDtoValidators
{
    public class UpdateProductDtoValidator : AbstractValidator<UpdateProductDto>
    {
        public UpdateProductDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MinimumLength(3);

            RuleFor(x => x.ExpirationDate)
                .NotEmpty();

            RuleFor(x => x.Description)
                .MinimumLength(3);
        }
    }
}
