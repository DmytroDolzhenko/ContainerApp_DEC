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
    public record CleanContainerCommand : IRequest<Container>, IAuditableContainerCommand
    {
        public required int ContainerId { get; init; }
        public required int UserId { get; init; }
        public string ActionDescription => "Cleaned the container";
        public int? ProductId => null;
    }
    public class CleanContainerCommandHandler
        (IContainerQueries queries)
        : IRequestHandler<CleanContainerCommand, Container>
    {
        public async Task<Container> Handle(CleanContainerCommand request, CancellationToken cancellationToken)
        {
            var container = await queries.GetByIdAsync(request.ContainerId, cancellationToken);

            if (container is null)
            {
                throw new KeyNotFoundException($"Container with Id {request.ContainerId} not found.");
            }

            container.CleanContainer(request.UserId);
            return container;
        }
    }
}
