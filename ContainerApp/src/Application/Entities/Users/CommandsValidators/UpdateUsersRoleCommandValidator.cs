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
    public class UpdateUsersRoleCommandValidator : AbstractValidator<UpdateUserRolesCommand>
    {
        public UpdateUsersRoleCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Role).NotEmpty();
        }
    }
}
