using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.ContainerTypeProductTypes;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.ContainerProductTypes
{
    public record DeleteContainerProductType : IRequest
    {
        public required int ContainerTypeId { get; init; }
        public required int ProductTypeId { get; init; }
    }

    public class DeleteContainerProductTypeHandler
        (IEntityRepository<ContainerTypeProductType> repository,
         IGetQueries<ContainerTypeProductType> getQueries)
        : IRequestHandler<DeleteContainerProductType>
    {
        public async Task Handle(DeleteContainerProductType request, CancellationToken cancellationToken)
        {
            var compliances = await getQueries.GetAllAsync(cancellationToken);
            var entity = compliances.FirstOrDefault(x =>
                x.ProductTypeId == request.ProductTypeId &&
                x.ContainerTypeId == request.ContainerTypeId);

            if (entity is null)
            {
                throw new KeyNotFoundException("Compliance record not found.");
            }

            await repository.DeleteAsync(entity, cancellationToken);
        }
    }
}
