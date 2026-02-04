using Domain.ProductTypes;

namespace Api.Dtos
{
    public record ProductTypeDtos(
       int Id,
       string Name
       )
    {
        public static ProductTypeDtos FromDomain(ProductType productType)
                => new(productType.Id,
                    productType.Name);
    }
    public record CreateProductTypeDto(string Name);
    public record UpdateProductTypeDto(string Name);
}
