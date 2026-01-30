using Domain.ProductTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IProductTypeRepository
    {
        Task<ProductType> AddAsync(ProductType entity, CancellationToken cancellationToken);
        Task<ProductType> UpdateAsync(ProductType entity, CancellationToken cancellationToken);
        Task<ProductType> DeleteAsync(ProductType entity, CancellationToken cancellationToken);
    }
}
