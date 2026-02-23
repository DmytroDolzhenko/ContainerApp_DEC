using Api.Dtos;
using Application.Common.Interfaces.Queries;
using Application.Entities.Containers.Commands;
using Application.Entities.ContainerTypes.Commands;
using Application.Entities.ProductTypes.Commands;
using Domain.ContainerTypes;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Authorize]
    [Route("api/container-type")]
    [ApiController]
    public class ContainerTypeController(
        IContainerTypeQueries queries, ISender sender)
        : ControllerBase
    {
        [HttpGet]
        public async Task<IReadOnlyList<ContainerTypeDto>> GetContainerTypes(CancellationToken cancellationToken)
        {
            var containerTypes = await queries.GetAllAsync(cancellationToken);
            return containerTypes.Select(ContainerTypeDto.FromDomain)
                .ToList();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ContainerTypeDto>> GetContainerTypeById(int id, CancellationToken cancellationToken)
        {
            var result = await queries.GetByIdAsync(id, cancellationToken);

            if (result is null)
            {
                return NotFound();
            }

            return ContainerTypeDto.FromDomain(result);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ContainerTypeDto>> UpdateContainerType(
           [FromRoute] int id,
           [FromBody] UpdateContainerTypeDto request,
           CancellationToken cancellationToken)
        {
            var command = new UpdateContainerTypeCommand
            {
                Id = id,
                Name = request.Name,
                Capacity = request.Capacity
            };

            var updatedType = await sender.Send(command, cancellationToken);

            return ContainerTypeDto.FromDomain(updatedType);
        }

        [HttpPost]
        public async Task<IResult> CreateContainerType([FromBody] CreateContainerTypeDto dto, CancellationToken cancellationToken)
        {
            var input = new CreateContainerTypeCommand { TypeName = dto.Name, Capacity = dto.Capacity };

            var result = await sender.Send(input, cancellationToken);

            return Results.Created($"/container-types/{result.Id}", result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteContainerType(int id, CancellationToken cancellationToken)
        {
            var input = new DeleteContainerTypeCommand { ContainerTypeId = id };

            await sender.Send(input, cancellationToken);

            return NoContent();
        }
    }
}
