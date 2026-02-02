using Domain.ContainerHistories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IContainerHistoryRepositories
    {
        Task<ContainerHistory> AddAsync(ContainerHistory containerHistory, CancellationToken cancellationToken);
        Task<ContainerHistory> DeleteAsync(ContainerHistory containerHistory, CancellationToken cancellationToken);

    }
}
