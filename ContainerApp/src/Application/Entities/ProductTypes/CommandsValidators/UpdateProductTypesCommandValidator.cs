using Application.Entities.ProductTypes.Commands;
using Application.Entities.Users.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.ProductTypes.CommandsValidators
{
    public class UpdateProductTypesCommandValidator : AbstractValidator<UpdateProductTypesCommand>
    {
        public UpdateProductTypesCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MinimumLength(3).MaximumLength(255);
        }
    }
}
