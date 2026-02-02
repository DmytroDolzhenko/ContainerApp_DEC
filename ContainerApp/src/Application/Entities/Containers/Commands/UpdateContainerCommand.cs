using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Containers;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Containers.Commands
{
    public record UpdateContainerCommand : IRequest<Container>
    {
        public required ContainerId Id { get; init; }
        public required string Name { get; init; }
        public required double Capacity { get; init; }
        public required string Description { get; init; }
    }
    public class UpdateContainerCommandHandler
        (IContainerQueries queries, IContainerRepositories repositories)
        : IRequestHandler<UpdateContainerCommand, Container>
    {
        public async Task<Container> Handle(UpdateContainerCommand request, CancellationToken cancellationToken)
        {
            var container = await queries.GetByIdAsync(request.Id, cancellationToken);

            if (container is null)
            {
                throw new KeyNotFoundException($"Container with Id {request.Id} not found.");
            }
            
            container.UpdateDetails(request.Id, request.Name, request.Capacity, request.Description);
            await repositories.UpdateAsync(container, cancellationToken);
            return container;
        }
    }
}
