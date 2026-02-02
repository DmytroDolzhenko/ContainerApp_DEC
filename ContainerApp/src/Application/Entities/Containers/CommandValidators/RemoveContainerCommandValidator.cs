using Application.Entities.Containers.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Containers.CommandValidators
{
    public class RemoveContainerCommandValidator : AbstractValidator<RemoveContainerCommand>
    {
        public RemoveContainerCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Container Id is required.");
        }
    }
}
