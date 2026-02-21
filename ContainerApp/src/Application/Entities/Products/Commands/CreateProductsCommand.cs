using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Products;
using Domain.ProductTypes;
using MediatR;
using System;


namespace Application.Products.Commands
{
    public record CreateProductsCommand : IRequest<Product>
    {
        public required string Name { get; init; }
        public required int ProductTypeId { get; init; }
        public required DateTime ExpirationDate { get; init; }

        public required DateTime? ManufactureData { get; init; }

        public string? Description { get; init; }
    }

    public class CreateProductsCommandHandler(
        IEntityRepository<Product> productRepository
    ) : IRequestHandler<CreateProductsCommand, Product>
    {
        public async Task<Product> Handle(
            CreateProductsCommand request,
            CancellationToken cancellationToken)
        {
            var utcExpirationDate = DateTime.SpecifyKind(request.ExpirationDate, DateTimeKind.Utc);

            var utcManufactureData = request.ManufactureData.HasValue
                ? DateTime.SpecifyKind(request.ManufactureData.Value, DateTimeKind.Utc)
                : (DateTime?)null;

            var product = Product.Create(
                0,
                request.ProductTypeId,
                request.Name,
                utcExpirationDate,
                utcManufactureData,
                request.Description ?? string.Empty
            );

            await productRepository.AddAsync(product, cancellationToken);

            return product;
        }
    }
}