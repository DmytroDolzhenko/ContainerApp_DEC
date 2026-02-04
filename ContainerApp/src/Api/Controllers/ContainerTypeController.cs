using Api.Dtos;
using Application.Common.Interfaces.Queries;
using Application.Entities.Containers.Commands;
using Application.Entities.ContainerTypes.Commands;
using Domain.ContainerTypes;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    public class ContainerTypeController(IContainerTypeQueries queries, ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<IReadOnlyList<ContainerTypeDto>> GetContainerTypes(CancellationToken cancellationToken)
        {
            var containerTypes = await queries.GetAllAsync(cancellationToken);
            return containerTypes.Select(ContainerTypeDto.FromDomain).ToList();
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

        [HttpPost]
        public async Task<ActionResult<ContainerTypeDto>> CreateContainerType([FromBody] CreateContainerTypeDto dto, CancellationToken cancellationToken)
        {
            var input = new CreateContainerTypeCommand { TypeName = dto.Name };

            var result = await sender.Send(input, cancellationToken);

            return ContainerTypeDto.FromDomain(result);
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
