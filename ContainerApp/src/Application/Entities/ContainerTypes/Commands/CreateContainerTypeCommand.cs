using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.ContainerTypes;
using Application.Common.Interfaces.Repositories;
using Application.Common.Interfaces.Queries;

namespace Application.Entities.ContainerTypes.Commands
{
    public record CreateContainerTypeCommand : IRequest<ContainerType>
    {
        public required string TypeName { get; init; }
        public required int Capacity { get; init; }
    }
    public class CreateContainerTypeCommandHandler
        (IEntityRepository<ContainerType> repositories,
        IContainerTypeQueries containerTypeQueries)
        : IRequestHandler<CreateContainerTypeCommand, ContainerType>
    {
        public async Task<ContainerType> Handle(CreateContainerTypeCommand request, CancellationToken cancellationToken)
        {
            var existingType = await containerTypeQueries.GetByNameAsync(request.TypeName, cancellationToken);

            if (existingType != null)
            {
                existingType.MarkAsUndeleted();
                existingType.UpdateDetails(request.TypeName, request.Capacity);
                return existingType;
            }
            else
            {
                var containerType = ContainerType.CreateNew(
                     request.TypeName,
                     request.Capacity
                 );
                await repositories.AddAsync(containerType, cancellationToken);
                return containerType;
            }
        }
    }
}
