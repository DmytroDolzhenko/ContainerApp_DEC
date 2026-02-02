using Application.Entities.Containers.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Containers.CommandValidators
{
    public class FillingContainerCommandValidator : AbstractValidator<FillingContainerCommand>
    {
        public FillingContainerCommandValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("User Id is required.");
            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product Id is required.");
            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Amount must be greater than zero.");
        }
    }
}
