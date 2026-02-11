using Domain.Products;
namespace Api.Dtos
{
    public record ProductDto(
        int Id,
        int ProductTypeId,
        string Name,
      //  double Capacity,
        DateTime ExpirationDate,
        DateTime? ManufactureDate,
        string Description
    )
    {
        public static ProductDto FromDomain(Product product)
            => new(
                product.Id,
                product.ProductTypeId,
                product.Name,
           //     product.Capacity,
                product.ExpirationDate,
                product.ManufactureDate,
                product.Description
            );
    }

    public record CreateProductDto(
        int TypeId,       
        string Name,
     //   double Capacity, 
        DateTime ExpirationDate,
        string Description
    );

    public record UpdateProductDto(
        string Name,
    //    double Capacity,
        DateTime ExpirationDate,
        string Description
    );
}