using Domain.ContainerTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IContainerTypeRepositories
    {
        Task AddAsync(ContainerType containerType, CancellationToken cancellationToken);
        Task UpdateAsync(ContainerType containerType, CancellationToken cancellationToken);
        Task DeleteAsync(ContainerType containerType, CancellationToken cancellationToken);
    }
}
