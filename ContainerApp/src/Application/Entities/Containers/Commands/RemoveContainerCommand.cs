using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Containers;
using Application.Common.Interfaces.Repositories;
using Application.Common.Interfaces.Queries;

namespace Application.Entities.Containers.Commands
{
    public record RemoveContainerCommand : IRequest
    {
        public required int Id { get; init; }
    }
    public class DeleteContainerCommandHandler
        (IContainerRepositories repositories, IContainerQueries queries)
        : IRequestHandler<RemoveContainerCommand>
    {
        public async Task Handle(RemoveContainerCommand request, CancellationToken cancellationToken)
        {
            var container = await queries.GetByIdAsync(request.Id, cancellationToken);

            if (container is null)
            {
                throw new KeyNotFoundException($"Container with id {request.Id} not found.");
            }

            await repositories.DeleteAsync(container, cancellationToken);
        }
    }
}
