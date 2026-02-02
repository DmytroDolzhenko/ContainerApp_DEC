using Application.Entities.Containers.Commands;
using Application.Entities.ContainerTypes.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.ContainerTypes.CommandsValidators
{
    public class UpdateContainerTypeCommandValidator : AbstractValidator<UpdateContainerTypeCommand>
    {
        public UpdateContainerTypeCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Container Type Id is required.");
            RuleFor(x => x.Name).NotEmpty().MaximumLength(30);
        }
    }
}
