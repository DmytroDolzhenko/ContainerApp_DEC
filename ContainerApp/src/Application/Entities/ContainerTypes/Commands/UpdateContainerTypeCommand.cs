using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.ContainerTypes;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.ContainerTypes.Commands
{
    public record UpdateContainerTypeCommand : IRequest<ContainerType>
    {
        public required int Id;
        public required string Name;
        public required int Capacity;

    }

    public class UpdateContainerTypeCommandHandler
        (IEntityRepository<ContainerType> repositories, IGetQueries<ContainerType> queries)
        : IRequestHandler<UpdateContainerTypeCommand, ContainerType>
    {
        public async Task<ContainerType> Handle(UpdateContainerTypeCommand request, CancellationToken cancellationToken)
        {
            var containerType = await queries.GetByIdAsync(request.Id, cancellationToken);

            if (containerType is null)
            {
                throw new KeyNotFoundException($"ContainerType with Id {request.Id} was not found.");
            }

            containerType.UpdateDetails(request.Name, request.Capacity);

            await repositories.UpdateAsync(containerType, cancellationToken);
            return containerType;
        }
    }
}
