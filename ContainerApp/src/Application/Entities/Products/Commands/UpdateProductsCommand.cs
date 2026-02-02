using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Products;
using MediatR;

namespace Application.Products.Commands;

public record UpdateProductsCommand : IRequest<Product>
{
    public required ProductId Id { get; init; }
    public required string Name { get; init; }
    public required Guid ProductTypeId { get; init; }
    public required double Capacity { get; init; }
    public required DateTime ExpirationDate { get; init; }
    public string? Description { get; init; }
}

public class UpdateProductsCommandHandler(
    IProductRepository repository,
    IProductQueries queries)
    : IRequestHandler<UpdateProductsCommand, Product>
{
    public async Task<Product> Handle(
        UpdateProductsCommand request,
        CancellationToken cancellationToken)
    {
        var product = await queries.GetByIdAsync(
            request.Id,
            cancellationToken);

        product.Update(
            request.Name,
            request.Capacity,
            request.ExpirationDate,
            null,
            request.Description ?? string.Empty);

        await repository.UpdateAsync(product, cancellationToken);


        return product;
    }
}
