using Application.Entities.ProductTypes.Commands;
using Application.Products.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Products.CommandsValidators
{
    public class UpdateProductsCommandValidator : AbstractValidator<UpdateProductsCommand>
    {
        public UpdateProductsCommandValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MinimumLength(3).MaximumLength(255);
            RuleFor(x => x.Description).NotEmpty().MinimumLength(3).MaximumLength(500);
           // RuleFor(x => x.Capacity).NotEmpty();
            RuleFor(x => x.ExpirationDate).NotEmpty();
        }
    }
}
