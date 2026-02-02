using Application.Entities.ContainerTypes.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.ContainerTypes.CommandsValidators
{
    public class DeleteContainerTypeCommandValidator : AbstractValidator<DeleteContainerTypeCommand>
    {
        public DeleteContainerTypeCommandValidator()
        {
            RuleFor(x => x.ContainerTypeId)
                .NotEmpty().WithMessage("Container Type Id is required.");
        }
    }
}
