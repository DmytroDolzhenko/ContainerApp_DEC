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
    public class ContainerController(
        ISender sender,
        IQrCodeService qr,
        ICurrentUserService currentUserService,
        IContainerQueries containerQueries)
        : ControllerBase
    {
        [HttpGet]
        public async Task<IReadOnlyList<ContainerDto>> GetAllContainers(CancellationToken cancellationToken)
        {
            var containers = await containerQueries.GetAllAsync(cancellationToken);
            return containers.Select(ContainerDto.FromDomain).ToList();
        }

        [HttpGet("{uniqCode}/uniqCode")]
        public async Task<ActionResult<ContainerDto>> GetByUniqCode(string uniqCode, CancellationToken cancellationToken)
        {
            var result = await containerQueries.GetContainerByUniqCode(uniqCode, cancellationToken);
            if (result is null)
            {
                return NotFound();
            }
            return ContainerDto.FromDomain(result);
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

        [HttpGet("{uniqCode}/qr")]
        public IActionResult GetContainerQrCode(string uniqCode, CancellationToken cancellationToken)
        {
            var svg = qr.GenerateQrCode(uniqCode);

            return Content(svg, "image/svg+xml");
        }

        [HttpGet("expirationDate")]
        public async Task<IReadOnlyList<ContainerDto>> GetExpirationDate(CancellationToken cancellationToken)
        {
            var result = await containerQueries.GetExpiringContainersAsync(cancellationToken);
            return result.Select(ContainerDto.FromDomain).ToList();
        }

        [HttpPost]
        public async Task<ContainerDto> CreateContainer([FromBody] CreateContainerDto dto, CancellationToken cancellationToken)
        {
            var input = new CreateContainerCommand
            {
                Name = dto.Name,
                //Capacity = dto.Capacity,
                Description = dto.Description,
                ContainerTypeId = dto.ContainerTypeId
            };
            var result = await sender.Send(input, cancellationToken);

            return ContainerDto.FromDomain(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteContainer(int id, CancellationToken cancellationToken)
        {
            var container = await containerQueries.GetByIdAsync(id, cancellationToken);
            if (container is null)
            {
                return NotFound();
            }
            container.MarkAsDeleted(currentUserService.UserId ?? throw new UnauthorizedAccessException());

            var input = new RemoveContainerCommand { Id = id };
            await sender.Send(input, cancellationToken);
            //await sender.Send(input, cancellationToken);

            return NoContent();
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> UpdateContainer(int id, [FromBody] UpdateContainerDto dto, CancellationToken cancellationToken)
        {
            var userId = currentUserService.UserId ?? throw new UnauthorizedAccessException();

            var input = new UpdateContainerCommand
            {
                ContainerId = id,
                Name = dto.Name,
                //Capacity = dto.Capacity,
                Description = dto.Description,
                ContainerTypeName = dto.ContainerTypeName,
                UserId = userId
            };
            var result = await sender.Send(input, cancellationToken);

            return Ok(ContainerDto.FromDomain(result));
        }

        [HttpPut("{id:int}/fill")]
        public async Task<IActionResult> FillContainer(int id, [FromBody] FillContainerDto dto, CancellationToken cancellationToken)
        {
            var userId = currentUserService.UserId ?? throw new UnauthorizedAccessException();

            var input = new FillingContainerCommand
            {
                ContainerId = id,
                ProductId = dto.ProductId,
                Amount = dto.Amount,
                UserId = userId
            };

            var result = await sender.Send(input, cancellationToken);
            return Ok(ContainerDto.FromDomain(result));
        }

        [HttpPut("{id:int}/clean")]
        public async Task<IActionResult> CleanContainer(int id, CancellationToken cancellationToken)
        {
            var userId = currentUserService.UserId ?? throw new UnauthorizedAccessException();
            var input = new CleanContainerCommand
            {
                ContainerId = id,
                UserId = userId
            };

            var result = await sender.Send(input, cancellationToken);

            return Ok(ContainerDto.FromDomain(result));
        }

        [HttpPatch("{id:int}/addRule")]
        public async Task<IActionResult> AddRuleToContainer(int id, [FromBody] AddRuleDto dto, CancellationToken cancellationToken)
        {
            var input = new AddRuleCommand
            {
                ContainerId = id,
                ProductTypeId = dto.ProductTypeId,
            };

            var result = await sender.Send(input, cancellationToken);
            return Ok();
        }

        [HttpDelete("{id:int}/removeRule")]
        public async Task<IActionResult> RemoveRuleFromContainer(int id, [FromBody] RemoveRuleDto dto, CancellationToken cancellationToken)
        {
            var input = new RemoveRuleCommand
            {
                ContainerId = id,
                RuleId = dto.RuleId
            };
            var result = await sender.Send(input, cancellationToken);
            return Ok();
        }

        [HttpGet("{id:int}/getContainerRules")]
        public async Task<IActionResult> GetContainerRules(int id, CancellationToken cancellationToken)
        {
            var result = await containerQueries.GetContainerRulesAsync(id, cancellationToken);
            if (result is null)
            {
                return NotFound();
            }
            return Ok(result);
        }
    }
}
