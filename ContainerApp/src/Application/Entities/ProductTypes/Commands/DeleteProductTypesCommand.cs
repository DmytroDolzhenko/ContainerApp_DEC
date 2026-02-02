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
        public required ProductTypeId Id { get; init; }
    }

    public class DeleteProductTypesCommandHandler(
        IProductTypeRepository repository, IProductTypeQueries queries)
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

            await repository.DeleteAsync(productType, cancellationToken);
            await repository.SaveChangesAsync(cancellationToken);
        }
    }
}
