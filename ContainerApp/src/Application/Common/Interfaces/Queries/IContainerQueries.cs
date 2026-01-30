using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Containers;
using Domain.ContainerTypes;
using Domain.Products;
using Domain.ProductTypes;

namespace Application.Common.Interfaces.Queries
{
    public interface IContainerQueries
    {
        Task<IReadOnlyList<Container>> GetAllAsync(CancellationToken cancellationToken);
        Task<Container> GetByIdAsync (ContainerId id, CancellationToken cancellationToken);
        Task<Container> GetByContainerType (ContainerTypeId containerTypeId, CancellationToken cancellationToken);
        Task<IReadOnlyList<Container>> GetByProductAsync(ProductId productId, CancellationToken cancellationToken);
        Task<IReadOnlyList<Container>> GetByProductTypeAsync(ProductTypeId productTypeId, CancellationToken cancellationToken);

    }
}
