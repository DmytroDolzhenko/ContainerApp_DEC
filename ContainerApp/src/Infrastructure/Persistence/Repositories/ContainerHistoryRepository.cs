using Application.Common.Interfaces.Repositories;
using Domain.ContainerHistories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class ContainerHistoryRepository : IContainerHistoryRepositories
    {
        private readonly ApplicationDbContext _context;
        public ContainerHistoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }
       /* public async Task<ContainerHistory> AddAsync(ContainerHistory containerHistory, CancellationToken cancellationToken)
        {
            await _context.ContainerHistory.AddAsync(containerHistory, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return containerHistory;
        }

        public async Task<ContainerHistory> DeleteAsync(ContainerHistory containerHistory, CancellationToken cancellationToken)
        {
            _context.ContainerHistory.Remove(containerHistory);
            await _context.SaveChangesAsync(cancellationToken);
            return containerHistory;
        }*/
    }
}
