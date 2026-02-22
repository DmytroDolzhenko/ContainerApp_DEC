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
    public class ProductQueries : IProductQueries
    {
        private readonly ApplicationDbContext _context;
        public ProductQueries(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IReadOnlyList<Product>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Products
                .Where(x => !x.IsDeleted)
                .ToListAsync(cancellationToken);
        }

        public async Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            var entity = await _context.Products
                .Where(x => !x.IsDeleted)
                .FirstOrDefaultAsync(x => x.Id.Equals(id), cancellationToken);

            return entity;
        }
    }
}
