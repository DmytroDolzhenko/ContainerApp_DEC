using Application.Common.Interfaces.Queries;
using Domain.ContainerHistories;
using Domain.Containers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Queries
{
    public class ContainerHistoryQueries : IContainerHistoryQueries
    {
        private readonly ApplicationDbContext _context;
        public ContainerHistoryQueries(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IReadOnlyList<ContainerHistory>> GetByContainerIdAsync(int containerId, CancellationToken cancellationToken)
        {
            return await _context.ContainerHistory
                .Where(ch => ch.ContainerId == containerId)
                .Include(ch => ch.Container)
                .Include(ch => ch.Product)
                .ToListAsync(cancellationToken);
        }
        //останній запис історії контейнера за датою оновлення
        public async Task<ContainerHistory?> GetLatestByContainerIdAsync(int containerId, CancellationToken cancellationToken)
        {
            return await _context.ContainerHistory
                .Where(ch => ch.ContainerId == containerId)
                .Include(ch => ch.Container)
                .Include(ch => ch.Product)
                .OrderByDescending(ch => ch.UpdatedAt)
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
