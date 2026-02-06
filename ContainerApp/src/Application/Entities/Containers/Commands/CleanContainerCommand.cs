using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.ContainerHistories;
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
  /*  public interface IContainerHistoryWriter
    {
        Task AddHistory(Container container, CancellationToken cancellationToken);
    }*/
    public record CleanContainerCommand : IRequest<Container>
    {
        public required int ContainerId { get; init; }
        public required int UserId { get; init; }
        public string ActionDescription => "Cleaned the container";
        public int? ProductId => null;
    }
    public class CleanContainerCommandHandler
        (IGetQueries<Container> getQueries,
        IEntityRepository<Container> repository,
        IEntityRepository<ContainerHistory> historyRepository)
        : IRequestHandler<CleanContainerCommand, Container>
    {
        public async Task<Container> Handle(CleanContainerCommand request, CancellationToken cancellationToken)
        {
            var container = await getQueries.GetByIdAsync(request.ContainerId, cancellationToken);

            if (container is null)
            {
                throw new KeyNotFoundException($"Container with Id {request.ContainerId} not found.");
            }

            container.CleanContainer(request.UserId);

            var history = ContainerHistory.CreateNew(
                 containerId: container.Id,
                 productId: request.ProductId,
                 action: request.ActionDescription,
                 userId: request.UserId,
                 dateTime: DateTime.UtcNow
            );
            await historyRepository.AddAsync(history, cancellationToken);

            await repository.UpdateAsync(container, cancellationToken);

            return container;
        }
    }
}
