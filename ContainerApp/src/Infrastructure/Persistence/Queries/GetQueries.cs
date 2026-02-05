using Application.Common.Interfaces.Queries;
using Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Queries
{
    public class GetQueries<T> where T : class, IEntity, IGetQueries<T>
    {
        private readonly ApplicationDbContext _context;
        public GetQueries(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Set<T>().ToListAsync(cancellationToken);
        }

        public async Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Set<T>()
                .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
        }
    }
}
 