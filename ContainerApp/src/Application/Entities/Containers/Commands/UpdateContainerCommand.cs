using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Containers;
using Domain.ContainerTypes;
using Domain.Products;
using Domain.Users;
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
        public required int ContainerId { get; init; }
        public required string Name { get; init; }
        public required double Capacity { get; init; }
        public required string Description { get; init; }
        public required string ContainerTypeName { get; init; }  
        public required int UserId { get; init; }
    }
    public class UpdateContainerCommandHandler
        (IGetQueries<Container> queries, IGetQueries<ContainerType> typesQueries, IEntityRepository<Container> repositories)
        : IRequestHandler<UpdateContainerCommand, Container>
    {
        public async Task<Container> Handle(UpdateContainerCommand request, CancellationToken cancellationToken)
        {
            var container = await queries.GetByIdAsync(request.ContainerId, cancellationToken);

            var allTypes = await typesQueries.GetAllAsync(cancellationToken);
            var selectedType = allTypes.FirstOrDefault(t => t.Name == request.ContainerTypeName);

            if (container is null)
            {
                throw new KeyNotFoundException($"Container with Id {request.ContainerId} not found.");
            }
            
            container.UpdateDetails(
                request.ContainerId,
                request.Name,
                request.Capacity,
                request.Description,
                selectedType.Id);

            await repositories.UpdateAsync(container, cancellationToken);
            return container;
        }
    }
}
