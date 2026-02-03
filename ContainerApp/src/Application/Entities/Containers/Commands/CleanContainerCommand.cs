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
using Application.Common.Interfaces;
using Domain.Products;

namespace Application.Entities.Containers.Commands
{
    public record CleanContainerCommand : IRequest, IAuditableContainerCommand
    {
        public required ContainerId ContainerId { get; init; }
        public required UserId UserId { get; init; }
        public string ActionDescription => "Cleaned the container";
        public ProductId? ProductId => null;
    }
    public class CleanContainerCommandHandler
        (IContainerQueries queries)
        : IRequestHandler<CleanContainerCommand>
    {
        public async Task Handle(CleanContainerCommand request, CancellationToken cancellationToken)
        {
            var container = await queries.GetByIdAsync(request.ContainerId, cancellationToken);

            if (container is null)
            {
                throw new KeyNotFoundException($"Container with Id {request.ContainerId} not found.");
            }

            container.CleanContainer(request.UserId);
        }
    }
}
