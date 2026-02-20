using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Products;
using MediatR;

namespace Application.Products.Commands;

public record UpdateProductsCommand : IRequest<Product>
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    // public required double Capacity { get; init; }
    public required DateTime ExpirationDate { get; init; }
    public required DateTime? ManufactureData {  get; init; }
    public string? Description { get; init; }
}

public class UpdateProductsCommandHandler(
    IEntityRepository<Product> repository,
    IGetQueries<Product> queries)
    : IRequestHandler<UpdateProductsCommand, Product>
{
    public async Task<Product> Handle(
        UpdateProductsCommand request,
        CancellationToken cancellationToken)
    {
        var product = await queries.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (product is null)
        {
            throw new KeyNotFoundException($"Product with ID {request.Id} not found.");
        }

        var utcExpirationDate = DateTime.SpecifyKind(request.ExpirationDate, DateTimeKind.Utc);

        var utcManufactureData = request.ManufactureData.HasValue
            ? DateTime.SpecifyKind(request.ManufactureData.Value, DateTimeKind.Utc)
            : (DateTime?)null;

        product.Update(
            request.Name,
            utcExpirationDate,
            utcManufactureData,
            request.Description ?? string.Empty);

        await repository.UpdateAsync(product, cancellationToken);

        return product;
    }
}