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
        public required ProductTypeId Id { get; init; }
        public required string Name { get; init; }
    }

    public class UpdateProductTypesCommandHandler(
        IProductTypeRepository repository,
        IProductTypeQueries queries)
        : IRequestHandler<UpdateProductTypesCommand, ProductType>
    {
        public async Task<ProductType> Handle(
            UpdateProductTypesCommand request,
            CancellationToken cancellationToken)
        {
            var productType = await queries.GetByIdAsync(
                request.Id,
                cancellationToken);

            productType.Update(
                request.Name
                );
            await repository.UpdateAsync(productType, cancellationToken);
            await repository.SaveChangesAsync(cancellationToken);

            return productType;
        }
    }
}
