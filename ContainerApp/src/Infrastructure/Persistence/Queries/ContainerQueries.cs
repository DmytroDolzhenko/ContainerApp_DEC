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
      /*  public async Task<IReadOnlyList<Container>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Containers.ToListAsync(cancellationToken);
        }*/

        public async Task<Container?> GetByContainerType(int containerTypeId, CancellationToken cancellationToken)
        {
            var containers = await _context.Containers
                .Where(c => c.TypeId == containerTypeId)
                .SingleOrDefaultAsync(cancellationToken);

            return containers;
        }

       /* public async Task<Container?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            var container = await _context.Containers
                .Where(c => c.Id == id)
                .SingleOrDefaultAsync(cancellationToken);

            return container;
        }*/

        public async Task<IReadOnlyList<Container>> GetByProductAsync(int productId, CancellationToken cancellationToken)
        {
            var containers = await _context.Containers
                .Where(c => c.ProductId == productId)
                .ToListAsync(cancellationToken);

            return containers;
        }

        public async Task<IReadOnlyList<Container>> GetByProductTypeAsync(int productTypeId, CancellationToken cancellationToken)
        {
            return await _context.Containers
                .Include(c => c.ProductId)
                .Where(c => _context.Products
                .Any(p => p.Id == c.ProductId && p.ProductTypeId == productTypeId))
                .ToListAsync(cancellationToken);
        }
    }
}
