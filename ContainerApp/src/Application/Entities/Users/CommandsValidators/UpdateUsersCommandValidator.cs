using Application.Entities.ProductTypes.Commands;
using Application.Entities.Users.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Users.CommandsValidators
{
    public class UpdateUsersCommandValidator : AbstractValidator<UpdateUsersCommand>
    {
        public UpdateUsersCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MinimumLength(3).MaximumLength(255);
            RuleFor(x => x.Surname).NotEmpty().EmailAddress().MaximumLength(255);
            RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(255);
            RuleFor(x => x.Identifier).NotEmpty();
        }
    }
}
