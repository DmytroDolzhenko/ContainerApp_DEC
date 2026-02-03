using Domain.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Queries
{
    public interface IProductQueries
    {
        Task<IReadOnlyList<Product>> GetAllAsync(CancellationToken cancellationToken);
        Task<Product?> GetByIdAsync(ProductId id, CancellationToken cancellationToken);
    }
}
