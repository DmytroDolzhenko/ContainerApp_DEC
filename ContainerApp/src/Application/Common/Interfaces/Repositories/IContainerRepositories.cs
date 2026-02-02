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
        Task<Container> AddAsync(Container container, CancellationToken cancellationToken);
        Task<Container> UpdateAsync(Container container, CancellationToken cancellationToken);
        Task<Container> DeleteAsync(Container container, CancellationToken cancellationToken);
    }
}
