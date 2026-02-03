using Application.Common.Interfaces.Repositories;
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
        IProductTypeRepository repository
    ) : IRequestHandler<CreateProductTypesCommand, ProductType>
    {
        public async Task<ProductType> Handle(
            CreateProductTypesCommand request,
            CancellationToken cancellationToken)
        {

            var productType = ProductType.Create(
                0,
                request.Name
            );

            return await repository.AddAsync(productType, cancellationToken);
        }
    }

}
