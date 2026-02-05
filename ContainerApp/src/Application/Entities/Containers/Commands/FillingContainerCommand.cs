using Application.Common.Interfaces;
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
    public record FillingContainerCommand : IRequest<Container>, IContainerHistoryWritter
    {
        public required int ContainerId { get; init; }
        public required int? ProductId { get; init; }
        public required int UserId { get; init; }
        public required int Amount { get; init; }
        public string ActionDescription => "Сontainer was filled";
    }
    public class FillingContainerCommandHandler
        (IGetQueries<Container> getQueries)
        : IRequestHandler<FillingContainerCommand, Container>
    {
        public async Task<Container> Handle(FillingContainerCommand request, CancellationToken cancellationToken)
        {
            var container = await getQueries.GetByIdAsync(request.ContainerId, cancellationToken);

            if (container is null)
            {
                throw new KeyNotFoundException($"Container with Id {request.ContainerId} not found.");
            }

            container.FillContainer(request.ProductId!.Value, request.UserId, request.Amount);
            return container;
        }
    }
}
