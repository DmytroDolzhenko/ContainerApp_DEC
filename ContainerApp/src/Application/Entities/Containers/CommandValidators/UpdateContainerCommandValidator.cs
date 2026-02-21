using Application.Entities.Containers.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Containers.CommandValidators
{
    public class UpdateContainerCommandValidator : AbstractValidator<UpdateContainerCommand>
    {
        public UpdateContainerCommandValidator()
        {
            RuleFor(x => x.ContainerId)
                .NotEmpty().WithMessage("Container Id is required.");
            //RuleFor(x => x.Capacity).NotEmpty();
            RuleFor(x => x.Description).NotEmpty().MaximumLength(150);
            RuleFor(x => x.Name).NotEmpty().MaximumLength(30);
        }
    }
}
