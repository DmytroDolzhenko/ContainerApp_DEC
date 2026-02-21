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
    public class CreateContainerTypeValidator : AbstractValidator<CreateContainerTypeCommand>
    {
        public CreateContainerTypeValidator()
        {
            RuleFor(x => x.TypeName).NotEmpty().MaximumLength(30);
            RuleFor(x => x.Capacity).GreaterThan(0);
        }
    }
}
