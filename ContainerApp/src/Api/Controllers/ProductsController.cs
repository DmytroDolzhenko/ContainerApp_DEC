using Microsoft.AspNetCore.Mvc;
using Application.Common.Interfaces.Queries;
using MediatR;
using Application.Products.Commands;
using Api.Dtos;
using Domain.Products;

namespace Api.Controllers
{
    [Route("products")]
    [ApiController]
    public class ProductsController(
        IGetQueries<Product> productQueries,
        ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductDto>>> GetProducts(CancellationToken cancellationToken)
        {
            var products = await productQueries.GetAllAsync(cancellationToken);

            return products.Select(ProductDto.FromDomain).ToList();
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(
            [FromBody] CreateProductDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateProductsCommand
            {
                Name = request.Name,
                ProductTypeId = request.TypeId,
                Capacity = request.Capacity,
                ExpirationDate = request.ExpirationDate,
                Description = request.Description
            };

            var newProduct = await sender.Send(input, cancellationToken);

            return Ok(newProduct);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ProductDto>> UpdateProduct(
            [FromRoute] int id,
            [FromBody] UpdateProductDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateProductsCommand
            {
                Id = id,
                Name = request.Name,
                Capacity = request.Capacity,
                ExpirationDate = request.ExpirationDate,
                Description = request.Description
            };

            var updatedProduct = await sender.Send(input, cancellationToken);

            return ProductDto.FromDomain(updatedProduct);
        }

        [HttpDelete("{productId:int}")]
        public async Task<ActionResult<ProductDto>> DeleteProduct(
            [FromRoute] int productId,
            CancellationToken cancellationToken)
        {
            var input = new DeleteProductsCommand
            {
                Id = productId
            };

            await sender.Send(input, cancellationToken);

            return NoContent();
        }

    }
}
