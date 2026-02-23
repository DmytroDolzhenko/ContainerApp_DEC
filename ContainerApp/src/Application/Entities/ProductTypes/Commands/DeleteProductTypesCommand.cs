using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Products;
using Domain.ProductTypes;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.ProductTypes.Commands
{
    public record DeleteProductTypesCommand : IRequest
    {
        public required int Id { get; init; }
    }

    public class DeleteProductTypesCommandHandler(
        IEntityRepository<ProductType> repository, IGetQueries<ProductType> queries)
        : IRequestHandler<DeleteProductTypesCommand>
    {
        public async Task Handle(
            DeleteProductTypesCommand request,
            CancellationToken cancellationToken)
        {
            var productType = await queries.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (productType is null)
            {
                throw new KeyNotFoundException(
                    $"Product with id {request.Id} not found");
            }

            productType.MarkAsDeleted();
            await repository.UpdateAsync(productType, cancellationToken);
            // await repository.DeleteAsync(productType, cancellationToken);
        }
    }
}
