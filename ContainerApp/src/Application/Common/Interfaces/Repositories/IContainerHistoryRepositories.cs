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
        Task AddAsync(ContainerHistory containerHistory, CancellationToken cancellationToken);
        //Task UpdateAsync(ContainerHistory containerHistory, CancellationToken cancellationToken);
        Task DeleteAsync(ContainerHistory containerHistory, CancellationToken cancellationToken);
        Task<int> SaveChangeAsync(CancellationToken cancellationToken);

    }
}
