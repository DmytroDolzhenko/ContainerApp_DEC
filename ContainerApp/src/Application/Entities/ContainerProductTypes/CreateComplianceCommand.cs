using Application.Common.Interfaces.Repositories;
using Domain.ContainerTypeProductTypes;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.ContainerProductTypes
{
    public record CreateComplianceCommand : IRequest<Unit>
    {
        public int ContainerTypeId { get; init; }
        public int ProductTypeId { get; init; }
    }
    public class CreateContainerProductTypesHandler
        (IEntityRepository<ContainerTypeProductType> repository)
        : IRequestHandler<CreateComplianceCommand, Unit>
    {
        public async Task<Unit> Handle(CreateComplianceCommand request, CancellationToken cancellationToken)
        {
            var compatibility = new ContainerTypeProductType(
                    request.ContainerTypeId,
                    request.ProductTypeId);

            await repository.AddAsync(compatibility, cancellationToken);

            return Unit.Value;
        }
    }
}
