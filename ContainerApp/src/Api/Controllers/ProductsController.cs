using Api.Dtos;
using Application.Common.Interfaces.Queries;
using Application.Products.Commands;
using Domain.Products;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController(
        IGetQueries<Product> productQueries,
        ISender sender) : ControllerBase
    {

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductDto>>> GetProducts(CancellationToken cancellationToken)
        {
            var products = await productQueries.GetAllAsync(cancellationToken);

            return products.Select(ProductDto.FromDomain).ToList();
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDto>> GetProductById(
            [FromRoute] int id,
            CancellationToken cancellationToken)
        {

            var product = await productQueries.GetByIdAsync(id, cancellationToken);

            if (product is null)
            {
                return NotFound();
            }

            return ProductDto.FromDomain(product);
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(
            [FromBody] CreateProductDto request,
            CancellationToken cancellationToken)
        {
            var expirationDateUtc = DateTime.SpecifyKind(request.ExpirationDate, DateTimeKind.Utc);

            var input = new CreateProductsCommand
            {
                Name = request.Name,
                ProductTypeId = request.TypeId,
                // Capacity = request.Capacity,
                ExpirationDate = expirationDateUtc,
                Description = request.Description
            };

            var newProduct = await sender.Send(input, cancellationToken);

            return Ok(ProductDto.FromDomain(newProduct));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ProductDto>> UpdateProduct(
            [FromRoute] int id,
            [FromBody] UpdateProductDto request,
            CancellationToken cancellationToken)
        {
            var expirationDateUtc = DateTime.SpecifyKind(request.ExpirationDate, DateTimeKind.Utc);

            var input = new UpdateProductsCommand
            {
                Id = id,
                Name = request.Name,
                // Capacity = request.Capacity,
                ExpirationDate = expirationDateUtc,
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