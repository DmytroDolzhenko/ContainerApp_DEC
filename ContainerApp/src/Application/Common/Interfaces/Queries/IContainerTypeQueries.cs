using Domain.ContainerTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Queries
{
    public interface IContainerTypeQueries
    {
        Task<IReadOnlyList<ContainerType?>> GetAllAsync(CancellationToken cancellationToken);
        Task<ContainerType?> GetByIdAsync(int id, CancellationToken cancellationToken);
    }
}
