using Application.Entities.ContainerProductTypes;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/product-container-compliance")]
    public class ProductContainerTypesController(ISender sender) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateComplianceCommand command,
            CancellationToken cancellationToken)
        {
            await sender.Send(command, cancellationToken);
            return Ok(new { Message = "Compliance created successfully" });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(
            [FromQuery] int productTypeId,
            [FromQuery] int containerTypeId,
            CancellationToken cancellationToken)
        {
            var command = new DeleteContainerProductType
            {
                ProductTypeId = productTypeId,
                ContainerTypeId = containerTypeId
            };

            await sender.Send(command, cancellationToken);

            return NoContent();
        }
    }
}
