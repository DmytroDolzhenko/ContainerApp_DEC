using Application.Common.Interfaces.Queries;
using Application.Entities.Containers.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Containers.CommandValidators
{
    public class CleanContainerCommandValidator : AbstractValidator<CleanContainerCommand>
    {
        public CleanContainerCommandValidator()
        {
            RuleFor(x => x.ContainerId)
                .NotEmpty().WithMessage("Container Id is required.");
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("User Id is required.");
        }
    }
}
