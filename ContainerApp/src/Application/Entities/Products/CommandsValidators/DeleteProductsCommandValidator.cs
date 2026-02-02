using Application.Products.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Products.CommandsValidators
{
    public class DeleteProductsCommandValidator : AbstractValidator<DeleteProductsCommand>
    {
        public DeleteProductsCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}
