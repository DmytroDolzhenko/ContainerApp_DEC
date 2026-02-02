using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Containers;
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
    public record FillingContainerCommand : IRequest<Container>
    {
        public required ContainerId Id { get; init; }
        public required ProductId ProductId { get; init; }
        public required UserId UserId { get; init; }
        public required int Amount { get; init; }
    }
    public class FillingContainerCommandHandler
        (IContainerQueries queries, IContainerRepositories repositories)
        : IRequestHandler<FillingContainerCommand, Container>
    {
        public async Task<Container> Handle(FillingContainerCommand request, CancellationToken cancellationToken)
        {
            var container = await queries.GetByIdAsync(request.Id, cancellationToken);

            if (container is null)
            {
                throw new KeyNotFoundException($"Container with Id {request.Id} not found.");
            }

            container.FillContainer(request.ProductId, request.UserId, request.Amount);
           // await repositories.UpdateAsync(container, cancellationToken);
            await repositories.SaveChangeAsync(cancellationToken);
            return container;
        }
    }
}
