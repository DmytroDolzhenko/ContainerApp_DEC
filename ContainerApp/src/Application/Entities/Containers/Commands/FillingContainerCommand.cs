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
    public record FillingContainerCommand : IRequest<Container>
    {
        public required int ContainerId { get; init; }
        public required int ProductId { get; init; }
        public required int UserId { get; init; }
        public required int Amount { get; init; }
        public string ActionDescription => "Сontainer was filled";
    }
    public class FillingContainerCommandHandler
        (IContainerQueries getQueries,
        IGetQueries<Product> getProductQueries,
        IEntityRepository<ContainerHistory> historyRepository,
        IEntityRepository<Container> repository,
        IProductContainerCompliance containerCompliance)
        : IRequestHandler<FillingContainerCommand, Container>
    {
        public async Task<Container> Handle(FillingContainerCommand request, CancellationToken cancellationToken)
        {
            var container = await getQueries.GetByIdAsync(request.ContainerId, cancellationToken);
            var product = await getProductQueries.GetByIdAsync(request.ProductId, cancellationToken);

            if (product is null)
            {
                throw new KeyNotFoundException($"Product with Id {request.ProductId} not found.");
            }

            if (container is null)
            {
                throw new KeyNotFoundException($"Container with Id {request.ContainerId} not found.");
            }

          /*  var compliantResult = await containerCompliance.IsProductCompliantWithContainer
            (container.TypeId, product.ProductTypeId, cancellationToken);*/
           
           /* if (!compliantResult)
            {
                throw new InvalidOperationException($"Product with Id {request.ProductId} is not compliant with Container Type Id {container.TypeId}");
            }*/

            container.FillContainer(product, request.UserId, request.Amount);

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
