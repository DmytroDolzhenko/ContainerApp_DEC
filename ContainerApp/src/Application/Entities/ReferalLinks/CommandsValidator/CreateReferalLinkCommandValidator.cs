using Application.Entities.ReferalLinks.Commands;
using Application.Products.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.ReferalLinks.CommandsValidator
{
    public class CreateReferalLinkCommandValidator : AbstractValidator<CreateReferalLinkCommand>
    {
        public CreateReferalLinkCommandValidator()
        {
            RuleFor(x => x.AdminId).NotEmpty();
        }
    }
}
