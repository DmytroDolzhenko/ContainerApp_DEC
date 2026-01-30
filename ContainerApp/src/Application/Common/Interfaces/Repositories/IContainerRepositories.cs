using Domain.Containers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IContainerRepositories
    {
        Task AddAsync(Container container, CancellationToken cancellationToken);
        Task UpdateAsync(Container container, CancellationToken cancellationToken);
        Task DeleteAsync(Container container, CancellationToken cancellationToken);
    }
}
