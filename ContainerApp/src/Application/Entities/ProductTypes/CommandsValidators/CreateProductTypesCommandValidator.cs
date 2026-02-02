using Application.Entities.ProductTypes.Commands;
using Application.Products.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.ProductTypes.CommandsValidators
{
    public class CreateProductTypesCommandValidator : AbstractValidator<CreateProductTypesCommand>
    {
        public CreateProductTypesCommandValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MinimumLength(3).MaximumLength(255);
        }
    }
}
