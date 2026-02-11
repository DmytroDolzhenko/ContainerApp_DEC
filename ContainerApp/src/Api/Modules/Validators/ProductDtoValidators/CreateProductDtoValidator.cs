using Api.Dtos;
using FluentValidation;

namespace Api.Modules.Validators.ProductDtoValidators
{
    public class CreateProductDtoValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductDtoValidator()
        {
            RuleFor(x => x.TypeId)
                .NotEmpty();

            RuleFor(x => x.Name)
                .NotEmpty()
                .MinimumLength(3);

/*            RuleFor(x => x.Capacity)
                .NotEmpty();*/

            RuleFor(x => x.Description)
                .NotEmpty()
                .MinimumLength(3);
        }
    }
}
