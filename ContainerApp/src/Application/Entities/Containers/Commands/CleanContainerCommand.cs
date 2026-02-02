using Application.Common.Interfaces.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Containers;
using Domain.Users;
using Application.Common.Interfaces.Repositories;

namespace Application.Entities.Containers.Commands
{
    public record CleanContainerCommand : IRequest
    {
        public required ContainerId ContainerId { get; init; }
        public required UserId UserId { get; init; }
    }
    public class CleanContainerCommandHandler
        (IContainerQueries queries, IContainerRepositories repositories)
        : IRequestHandler<CleanContainerCommand>
    {
        public async Task Handle(CleanContainerCommand request, CancellationToken cancellationToken)
        {
            var container = await queries.GetByIdAsync(request.ContainerId, cancellationToken);

            container.CleanContainer(request.UserId);

            await repositories.SaveChangeAsync(cancellationToken);
        }
    }
}
