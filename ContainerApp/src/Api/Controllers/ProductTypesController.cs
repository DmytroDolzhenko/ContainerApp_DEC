using Api.Dtos;
using Application.Common.Interfaces.Queries;
using Application.Entities.ProductTypes.Commands;
using Domain.ProductTypes;
using Infrastructure.Persistence.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/product-types")]
    [ApiController]
    public class ProductTypesController(
         IGetQueries<ProductType> productTypeQueries,
         ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductTypeDtos>>> GetProductTypes(CancellationToken cancellationToken)
        {
            var types = await productTypeQueries.GetAllAsync(cancellationToken);

            return types.Select(ProductTypeDtos.FromDomain).ToList();

/*            var containers = await getQueries.GetAllAsync(cancellationToken);
            return containers.Select(ContainerDto.FromDomain).ToList();*/
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateProductType(
            [FromBody] CreateProductTypeDto request,
            CancellationToken cancellationToken)
        {
            var command = new CreateProductTypesCommand
            {
                Name = request.Name
            };

            var newTypeId = await sender.Send(command, cancellationToken);

            return Ok(newTypeId);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ProductTypeDtos>> UpdateProductType(
            [FromRoute] int id,
            [FromBody] UpdateProductTypeDto request,
            CancellationToken cancellationToken)
        {
            var command = new UpdateProductTypesCommand
            {
                Id = id,
                Name = request.Name
            };

            var updatedType = await sender.Send(command, cancellationToken);

            return Ok(ProductTypeDtos.FromDomain(updatedType));
        }

        // 4. Видалити тип
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteProductType(
            [FromRoute] int id,
            CancellationToken cancellationToken)
        {
            var command = new DeleteProductTypesCommand
            {
                Id = id
            };

            await sender.Send(command, cancellationToken);

            return NoContent();
        }
    }
}
