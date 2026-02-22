using Application.Common.Interfaces;
using Application.Entities.Containers.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Containers.CommandValidators
{
    public class FillingContainerCommandValidator : AbstractValidator<FillingContainerCommand>
    {
        private readonly IProductContainerCompliance _productCompliance;
        public FillingContainerCommandValidator(IProductContainerCompliance productCompliance)
        {
            _productCompliance = productCompliance;

            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product Id is required.");

            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Amount must be greater than zero.");

            /*RuleFor(x => x)
                .MustAsync(async (command, cancellation) =>
                {
                    if (command.ProductId <= 0 || command.ContainerId <= 0)
                        return false;

                    return await _productCompliance.IsProductCompliantWithContainer(
                        command.ProductId,
                        command.ContainerId,
                        cancellation);
                })
                .WithMessage(command => $"Продукт з Id {command.ProductId} не сумісний з типом цього контейнера.");*/
        }
    }
}
