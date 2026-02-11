using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Containers;
using Domain.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Services
{
    public class ProductContainerCompliance
        (IContainerTypeRepositories containerTypeRepository,
        IGetQueries<Product> productQueries,
        IGetQueries<Container> containerQueries)
        : IProductContainerCompliance
    {
        public async Task<bool> IsProductCompliantWithContainer(int productId, int containerId, CancellationToken cancellationToken)
        {
            var product = await productQueries.GetByIdAsync(productId, cancellationToken);
            var container = await containerQueries.GetByIdAsync(containerId, cancellationToken);

            if (product == null || container == null) return false;

            return await containerTypeRepository.IsCompatibleWithProductAsync(
                container.TypeId,
                product.ProductTypeId,
                cancellationToken);
        }
    }
}
