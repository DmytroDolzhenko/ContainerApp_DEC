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
    public record RemoveRuleCommand : IRequest<bool>
    {
        public required int ContainerId { get; init; }
        public required int RuleId { get; init; }
    }
    public class RemoveRuleCommandHandler
        (IContainerQueries containerQueries, IEntityRepository<Container> containerRepository) : IRequestHandler<RemoveRuleCommand, bool>
    {
        public async Task<bool> Handle(RemoveRuleCommand request, CancellationToken cancellationToken)
        {
            var container = await containerQueries.GetByIdAsync(request.ContainerId, cancellationToken);

            if (container == null) return false;

            container.RemoveRule(request.RuleId);

            await containerRepository.UpdateAsync(container, cancellationToken);

            return true;
        }
    }
}
