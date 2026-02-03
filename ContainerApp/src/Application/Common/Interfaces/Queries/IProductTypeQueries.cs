using Domain.ProductTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Queries
{
    public interface IProductTypeQueries
    {
        Task<IReadOnlyList<ProductType>> GetAllAsync(CancellationToken cancellationToken);
        Task<ProductType?> GetByIdAsync(ProductTypeId id, CancellationToken cancellationToken);
    }
}
