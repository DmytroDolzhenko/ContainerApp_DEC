using Application.Common.Interfaces.Queries;
using Domain.ContainerTypes;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Queries
{
    public class ContainerTypeQueries : IContainerTypeQueries
    {
        private readonly ApplicationDbContext _context;
        public ContainerTypeQueries(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IReadOnlyList<ContainerType>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.ContainerTypes.ToListAsync(cancellationToken);
        }

        public async Task<ContainerType?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.ContainerTypes.SingleOrDefaultAsync(ct => ct.Id == id, cancellationToken);
        }
    }
}
