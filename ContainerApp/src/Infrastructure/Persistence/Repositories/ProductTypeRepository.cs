using Application.Common.Interfaces.Repositories;
using Domain.ProductTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class ProductTypeRepository : IProductTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductTypeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ProductType> AddAsync(ProductType entity, CancellationToken cancellationToken)
        {
            await _context.ProductTypes.AddAsync(entity, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return entity;
        }

        public async Task<ProductType> UpdateAsync(ProductType entity, CancellationToken cancellationToken)
        {
            _context.ProductTypes.Update(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity;
        }

        public async Task<ProductType> DeleteAsync(ProductType entity, CancellationToken cancellationToken)
        {
            _context.ProductTypes.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity;
        }
    }
}

