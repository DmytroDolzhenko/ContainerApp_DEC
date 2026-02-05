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
        /*public async Task<IReadOnlyList<ProductType>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.ProductTypes
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }*/

       /* public async Task<ProductType?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            var entity = await _context.ProductTypes
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id.Equals(id), cancellationToken);

            return entity;
        }*/
    }
}
