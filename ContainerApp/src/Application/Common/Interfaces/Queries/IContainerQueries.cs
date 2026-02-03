using Domain.Containers;
using Domain.ContainerTypes;
using Domain.Products;
using Domain.ProductTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Queries
{
    public interface IContainerQueries
    {
        Task<IReadOnlyList<Container>> GetAllAsync(CancellationToken cancellationToken);
        Task<Container?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<Container?> GetByContainerType(int containerTypeId, CancellationToken cancellationToken);
        Task<IReadOnlyList<Container>> GetByProductAsync(int productId, CancellationToken cancellationToken);
        Task<IReadOnlyList<Container>> GetByProductTypeAsync(int productTypeId, CancellationToken cancellationToken);

    }
}
