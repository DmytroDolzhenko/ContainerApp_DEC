using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.ContainerTypes;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Containers;

namespace Application.Entities.Containers.Commands
{
    public record CreateContainerCommand : IRequest<Container>
    {
        public required string Name { get; init; }
        public required double Capacity { get; init; }
        public required string Description { get; init; }
        public required ContainerTypeId ContainerTypeId { get; init; }
    }

    public class CreateContainerCommandHandler
        (IContainerRepositories repositories)
        : IRequestHandler<CreateContainerCommand, Container>
    {
      public async Task<Container> Handle(CreateContainerCommand request, CancellationToken cancellationToken)
        {
           var container = Container.CreateNew(
                request.Name,
                request.Capacity,
                request.Description,
                request.ContainerTypeId
            );
            await repositories.AddAsync(container, cancellationToken);
            await repositories.SaveChangeAsync(cancellationToken);
            return container;
        }
    }
}
