using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.ContainerRules;
using Domain.Containers;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Containers.Commands
{
    public record AddRuleCommand : IRequest<bool>
    {
        public required int ContainerId { get; init; }
        public required int ProductTypeId { get; init; }
    }
    public class AddRuleCommandHandler
        (IContainerQueries containerQueries, IEntityRepository<Container> containerRepository) : IRequestHandler<AddRuleCommand, bool>
    {
        public async Task<bool> Handle(AddRuleCommand request, CancellationToken cancellationToken)
        {
            var container = await containerQueries.GetByIdAsync(request.ContainerId, cancellationToken);

            if (container == null) return false;

            container.AddRule(request.ProductTypeId);

            await containerRepository.UpdateAsync(container, cancellationToken);

            return true;
        }
    }
}
