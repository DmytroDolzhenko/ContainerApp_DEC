using Domain.Products;
namespace Api.Dtos
{
    public record ProductDto(
        int Id,
        int ProductTypeId,
        string ProductTypeName,
        string Name,
        DateTime ExpirationDate,
        DateTime? ManufactureDate,
        string? Description
    )
    {
        public static ProductDto FromDomain(Product product)
            => new(
                product.Id,
                product.ProductTypeId,
                product.ProductType?.Name,
                product.Name,
                product.ExpirationDate,
                product.ManufactureDate,
                product.Description
            );
    }

    public record CreateProductDto(
        int TypeId,       
        string Name,
        DateTime ExpirationDate,
        DateTime? ManufactureDate,
        string? Description
    );

    public record UpdateProductDto(
        string Name,
        DateTime ExpirationDate,
        DateTime? ManufactureDate,
        string? Description
    );
}