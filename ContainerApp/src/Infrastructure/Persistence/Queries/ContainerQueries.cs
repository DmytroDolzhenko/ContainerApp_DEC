using Application.Common.Interfaces.Queries;
using Domain.ContainerRules;
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
        public async Task<IReadOnlyList<Container>> GetAllAsync(CancellationToken ct)
        {
            return await _context.Containers
                .Include(c => c.Product)
                .Include(c => c.Type)
                .Include(c => c.Rules)
                .ToListAsync(ct);
        }

        public async Task<Container?> GetByContainerType(int containerTypeId, CancellationToken cancellationToken)
        {
            var containers = await _context.Containers
                .Where(c => c.TypeId == containerTypeId)
                .SingleOrDefaultAsync(cancellationToken);

            return containers;
        }

        public async Task<Container?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            var container = await _context.Containers
                .Where(c => c.Id == id)
                .Include(c => c.Product)
                .Include(c => c.Type)
                .Include(c => c.Rules)
                .SingleOrDefaultAsync(cancellationToken);

            return container;
        }

        public async Task<IReadOnlyList<Container>> GetByProductAsync(int productId, CancellationToken cancellationToken)
        {
            var containers = await _context.Containers
                .Where(c => c.ProductId == productId)
                .Include(c => c.Product)
                .Include(c => c.Type)
                .Include(c => c.Rules)
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

        public async Task<Container?> GetContainerByUniqCode(string uniqCode, CancellationToken cancellationToken)
        {
            return await _context.Containers
                .Where(c => c.UniqCode == uniqCode)
                .Include(c => c.Product)
                .Include(c => c.Type)
                .Include(c => c.Rules)
                .SingleOrDefaultAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<ContainerRule>> GetContainerRulesAsync(int containerId, CancellationToken cancellationToken)
        {
            return await _context.ContainerRules
                .Where(cr => cr.ContainerId == containerId)
                .Include(cr => cr.ProductTypeForRule)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Container?>> GetExpiringContainersAsync(CancellationToken cancellationToken)
        {
            var warningDate = DateTime.UtcNow.AddDays(5);

            return await _context.Containers
                .Include(c => c.Product)
                .Include(c => c.Type)
                .Include(c => c.Rules)
                .Where(c => c.ProductId != null && c.Product.ExpirationDate <= warningDate)
                .ToListAsync(cancellationToken);
        }
    }
}
