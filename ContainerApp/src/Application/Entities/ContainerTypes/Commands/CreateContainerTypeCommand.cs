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
        (IEntityRepository<ContainerType> repositories)
        : IRequestHandler<CreateContainerTypeCommand, ContainerType>
    {
        public Task<ContainerType> Handle(CreateContainerTypeCommand request, CancellationToken cancellationToken)
        {
            var containerType = ContainerType.CreateNew(
                 request.TypeName,
                 request.Capacity
             );
            repositories.AddAsync(containerType, cancellationToken);
            return Task.FromResult(containerType);
        }
    }
}
