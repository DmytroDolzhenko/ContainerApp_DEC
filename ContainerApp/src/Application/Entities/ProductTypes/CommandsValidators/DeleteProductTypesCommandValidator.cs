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
    public class DeleteProductTypesCommandValidator : AbstractValidator<DeleteProductTypesCommand>
    {
        public DeleteProductTypesCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}
