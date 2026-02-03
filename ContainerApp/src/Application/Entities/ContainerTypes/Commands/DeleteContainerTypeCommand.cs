using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.ContainerTypes;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.ContainerTypes.Commands
{
    public record DeleteContainerTypeCommand : IRequest
    {
        public required int ContainerTypeId { get; init; }
    }

    public class DeleteContainerTypeCommandHandler
        (IContainerTypeRepositories repositories, IContainerTypeQueries queries)
        : IRequestHandler<DeleteContainerTypeCommand>
    {
        public async Task Handle(DeleteContainerTypeCommand request, CancellationToken cancellationToken)
        {
            var existingContainerType = await queries.GetByIdAsync(request.ContainerTypeId, cancellationToken);
            if (existingContainerType == null)
            {
                throw new InvalidOperationException("ContainerType with this ID does not ex ist");
            }
            await repositories.DeleteAsync(existingContainerType, cancellationToken);
        }
    }
}
