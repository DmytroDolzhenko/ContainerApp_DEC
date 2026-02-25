using Application.Common.Interfaces.Queries;
using Domain.ProductTypes;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Queries
{
    public class ProductTypeQueries : IProductTypeQueries
    {
        private readonly ApplicationDbContext _context;
        public ProductTypeQueries(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IReadOnlyList<ProductType>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.ProductTypes
                .Where(x => !x.IsDeleted)
                .ToListAsync(cancellationToken);
        }

        public async Task<ProductType?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            var entity = await _context.ProductTypes
                .Where(x => !x.IsDeleted)
                .FirstOrDefaultAsync(x => x.Id.Equals(id), cancellationToken);

            return entity;
        }

        public Task<ProductType?> GetByNameAsync(string name, CancellationToken cancellationToken)
        {
            var entity = _context.ProductTypes
                .FirstOrDefaultAsync(x => x.Name.Equals(name), cancellationToken);
            return entity;
        }
    }
}
