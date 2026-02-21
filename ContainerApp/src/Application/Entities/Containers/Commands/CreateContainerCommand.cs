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
        public required int ContainerTypeId { get; init; }
    }

    public class CreateContainerCommandHandler
        (IEntityRepository<Container> repositories,
        IGetQueries<ContainerType> containerTypeQueries
        )
        : IRequestHandler<CreateContainerCommand, Container>
    {
        public async Task<Container> Handle(CreateContainerCommand request, CancellationToken cancellationToken)
        {
            var containerType = await containerTypeQueries.GetByIdAsync(request.ContainerTypeId, cancellationToken);

            if (containerType == null)
            {
                throw new ArgumentException($"Container type with ID {request.ContainerTypeId} does not exist.");
            }

            var uniqCode = GenerateUniqueCode(containerType.Name, request.Name);

            var container = Container.CreateNew(
                request.Name,
                request.Description,
                uniqCode,
                request.ContainerTypeId
            );
            await repositories.AddAsync(container, cancellationToken);
            return container;
        }

        public string GenerateUniqueCode(string type, string name)
        {
            var namePart = new string(name.Where(char.IsLetter).Take(3).ToArray()).ToUpper();
            var typePrefix = type.Substring(0, Math.Min(3, type.Length)).ToUpper();
            var datePart = DateTime.Now.ToString("ddMMyy");
            var randomPart = Guid.NewGuid().ToString("N").Substring(0, 2).ToUpper();
            return $"{namePart.ToUpper()}-{typePrefix.ToUpper()}-{datePart}-{randomPart}";
        }
    }
}
