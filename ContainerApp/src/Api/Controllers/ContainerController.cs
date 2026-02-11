using Api.Dtos;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Application.Entities.Containers.Commands;
using Domain.Containers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Authorize]
    [Route("api/containers")]
    [ApiController]
    //тут зв'язок до домейн моделі, не знаю чи правильно
    public class ContainerController(
        ISender sender,
        IQrCodeService qr,
        IContainerQueries containerQueries)
        : ControllerBase
    {
        [HttpGet]
        public async Task<IReadOnlyList<ContainerDto>> GetAllContainers(CancellationToken cancellationToken)
        {
            var containers = await containerQueries.GetAllAsync(cancellationToken);
            return containers.Select(ContainerDto.FromDomain).ToList();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ContainerDto>> GetByContainerId(int id, CancellationToken cancellationToken)
        {
            var result = await containerQueries.GetByIdAsync(id, cancellationToken);

            if (result is null)
            {
                return NotFound();
            }
            return ContainerDto.FromDomain(result);
        }

        [HttpPost]
        public async Task<ContainerDto> CreateContainer([FromBody] CreateContainerDto dto, CancellationToken cancellationToken)
        {
            var input = new CreateContainerCommand
            {
                Name = dto.Name,
                Capacity = dto.Capacity,
                Description = dto.Description,
                ContainerTypeId = dto.ContainerTypeId
            };
            var result = await sender.Send(input, cancellationToken);

            return ContainerDto.FromDomain(result);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> UpdateContainer(int id, [FromBody] UpdateContainerDto dto, CancellationToken cancellationToken)
        {
            var input = new UpdateContainerCommand
            {
                ContainerId = id,
                Name = dto.Name,
                Capacity = dto.Capacity,
                Description = dto.Description,
                UserId = 1
            };
            var result = await sender.Send(input, cancellationToken);

            return Ok(ContainerDto.FromDomain(result));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteContainer(int id, CancellationToken cancellationToken)
        {
            var input = new RemoveContainerCommand { Id = id };

            await sender.Send(input, cancellationToken);

            return NoContent();
        }

        [HttpPut("{id:int}/fill")]
        public async Task<IActionResult> FillContainer(int id, [FromBody] FillContainerDto dto, CancellationToken cancellationToken)
        {
             var input = new FillingContainerCommand
            {
                ContainerId = id,
                ProductId = dto.ProductId,
                Amount = dto.Amount,
                UserId = 3
            };

            var result = await sender.Send(input, cancellationToken);
            return Ok(ContainerDto.FromDomain(result));
        }

        [HttpPut("{id:int}/clean")]
        public async Task<IActionResult> CleanContainer(int id, CancellationToken cancellationToken)
        {
            var input = new CleanContainerCommand
            {
                ContainerId = id,
                UserId = 3
            };

            var result = await sender.Send(input, cancellationToken);

            return Ok(ContainerDto.FromDomain(result));
        }

        [HttpGet("{id:int}/qr")]
        public IActionResult GetContainerQrCode(int id, CancellationToken cancellationToken)
        {
            var svg = qr.GenerateQrCode(id);

            return Content(svg, "image/svg+xml");
        }
    }
}
