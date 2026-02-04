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
        public required double Capacity { get; init; }
        public required DateTime ExpirationDate { get; init; }
        public string? Description { get; init; }
    }

    public class CreateProductsCommandHandler(
        IProductRepository productRepository
    ) : IRequestHandler<CreateProductsCommand, Product>
    {
        public async Task<Product> Handle(
            CreateProductsCommand request,
            CancellationToken cancellationToken)
        {

            var product = Product.Create(
                0,
                request.ProductTypeId,
                request.Name,
                request.Capacity,
                request.ExpirationDate,
                request.Description ?? string.Empty
            );

            return await productRepository.AddAsync(product, cancellationToken);
        }
    }
}