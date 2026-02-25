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
    public record CreateProductTypesCommand : IRequest<ProductType>
    {
        public required string Name { get; init; }
    }

    public class CreateProductTypesCommandHandler(
        IEntityRepository<ProductType> repository,
        IProductTypeQueries productTypeQueries
    ) : IRequestHandler<CreateProductTypesCommand, ProductType>
    {
        public async Task<ProductType> Handle(
            CreateProductTypesCommand request,
            CancellationToken cancellationToken)
        {
            var existingProductType = await productTypeQueries.GetByNameAsync(request.Name, cancellationToken);
            if (existingProductType != null)
            {
                existingProductType.MarkAsUndeleted();
                return existingProductType;
            }
            else
            {
                var productType = ProductType.Create(
                    0,
                    request.Name
                );

                await repository.AddAsync(productType, cancellationToken);
                return productType;
            }
        }
    }

}
