using Domain.ContainerHistories;
using Domain.Containers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Queries
{
    public interface IContainerHistoryQueries
    {
        Task<IReadOnlyList<ContainerHistory?>> GetByContainerIdAsync(ContainerId containerId, CancellationToken cancellationToken);
        Task<ContainerHistory?> GetLatestByContainerIdAsync(ContainerId containerId, CancellationToken cancellationToken);
    }
}
