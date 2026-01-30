using Domain.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IProductRepository
    {
        Task<Product> AddAsync(Product entity, CancellationToken cancellationToken);
        Task<Product> UpdateAsync(Product entity, CancellationToken cancellationToken);
        Task<Product> DeleteAsync(Product entity, CancellationToken cancellationToken);
        Task<Product?> GetByIdAsync(ProductId id, CancellationToken cancellationToken);

    }
}
