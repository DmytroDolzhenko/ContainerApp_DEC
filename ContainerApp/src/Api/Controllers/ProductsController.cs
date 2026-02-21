using Api.Dtos;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Application.Products.Commands;
using Domain.Products;
using Infrastructure.Persistence.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Authorize]
    [Route("api/products")]
    [ApiController]
    public class ProductsController(
        IGetQueries<Product> productQueries,
        ICurrentUserService currentUserService,
        ISender sender) : ControllerBase
    {
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
            var manufactureDateUtc = request.ManufactureDate.HasValue
            ? DateTime.SpecifyKind(request.ManufactureDate.Value, DateTimeKind.Utc)
            : (DateTime?)null;

            var input = new CreateProductsCommand
            {
                Name = request.Name,
                ProductTypeId = request.TypeId,
                ExpirationDate = expirationDateUtc,
                ManufactureData = manufactureDateUtc,
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

            var manufactureDateUtc = request.ManufactureDate != null
                ? DateTime.SpecifyKind(request.ManufactureDate.Value, DateTimeKind.Utc)
                : (DateTime?)null;

            var input = new UpdateProductsCommand
            {
                Id = id,
                Name = request.Name,
                ExpirationDate = expirationDateUtc,
                Description = request.Description,
                UpdatedBy = currentUserService.UserId ?? throw new UnauthorizedAccessException(),
                ManufactureData = manufactureDateUtc
            };

            var updatedProduct = await sender.Send(input, cancellationToken);

            return ProductDto.FromDomain(updatedProduct);
        }

        [HttpDelete("{productId:int}")]
        public async Task<ActionResult<ProductDto>> DeleteProduct(
            [FromRoute] int productId,
            CancellationToken cancellationToken)
        {
            var product = await productQueries.GetByIdAsync(productId, cancellationToken);

            if (product is null)
            {
                return NotFound();
            }

            product.MarkAsDeleted(currentUserService.UserId ?? throw new UnauthorizedAccessException());

            var input = new DeleteProductsCommand
            {
                Id = productId
            };

            await sender.Send(input, cancellationToken);

            return NoContent();
        }
    }
}