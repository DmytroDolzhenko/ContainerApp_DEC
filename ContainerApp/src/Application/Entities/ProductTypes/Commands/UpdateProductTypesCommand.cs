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
    public record UpdateProductTypesCommand : IRequest<ProductType>
    {
        public required int Id { get; init; }
        public required string Name { get; init; }
    }

    public class UpdateProductTypesCommandHandler(
        IEntityRepository<ProductType> repository,
        IGetQueries<ProductType> queries)
        : IRequestHandler<UpdateProductTypesCommand, ProductType>
    {
        public async Task<ProductType> Handle(
            UpdateProductTypesCommand request,
            CancellationToken cancellationToken)
        {
            var productType = await queries.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (productType == null)
            {
                throw new Exception($"ProductType with id {request.Id} not found.");
            }

            productType.Update(
            request.Name
            );
            await repository.UpdateAsync(productType, cancellationToken);

            return productType;
        }
    }
}
