using Application.Common.Interfaces.Queries;
using Domain.Containers;
using Domain.ContainerTypes;
using Domain.Products;
using Domain.ProductTypes;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Queries
{
    public class ContainerQueries : IContainerQueries
    {
        private readonly ApplicationDbContext _context;
        public ContainerQueries(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IReadOnlyList<Container>> GetAllAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();

        }

        public Task<Container> GetByContainerType(ContainerTypeId containerTypeId, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<Container> GetByIdAsync(ContainerId id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Container>> GetByProductAsync(ProductId productId, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Container>> GetByProductTypeAsync(ProductTypeId productTypeId, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
