using Api.Dtos;
using Application.Common.Interfaces.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("/containers")]
    [ApiController]
    public class ContainerHistoryController(IContainerHistoryQueries queries) : ControllerBase
    {
        [HttpGet("{id:int}/history")]
        public async Task<ActionResult> GetContainerHistory(int id, CancellationToken cancellationToken)
        {
            var history = await queries.GetByContainerIdAsync(id, cancellationToken);

            var result = history.Select(h => new ContainerHistoryDto(
                    h.Id, h.ContainerId, h.Container.Name, h.ProductId, h.Product?.Name, h.Action, h.UpdatedAt, h.UserId));

            return Ok(result);
        }

        [HttpGet("{id:int}/history/latest")]
        public async Task<ActionResult> GetLatestContainerHistory(int id, CancellationToken cancellationToken)
        {
            var latest = await queries.GetLatestByContainerIdAsync(id, cancellationToken);

            if (latest is null)
            {
                return NotFound();
            }

            return Ok(new ContainerHistoryDto(
                latest.Id,
                latest.ContainerId,
                latest.Container.Name,
                latest.ProductId,
                latest.Product?.Name,
                latest.Action,
                latest.UpdatedAt,
                latest.UserId)
                );
        }
    }
}
