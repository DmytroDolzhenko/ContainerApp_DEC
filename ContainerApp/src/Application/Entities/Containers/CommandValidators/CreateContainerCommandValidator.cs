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
    public class CreateContainerCommandValidator : AbstractValidator<CreateContainerCommand>
    {
        public CreateContainerCommandValidator()
        {
            RuleFor(x => x.ContainerTypeId).NotEmpty();
           // RuleFor(x => x.Capacity).NotEmpty();
            RuleFor(x => x.Description).NotEmpty().MaximumLength(150);
            RuleFor(x => x.Name).NotEmpty().MaximumLength(30);
        }
    }
}
