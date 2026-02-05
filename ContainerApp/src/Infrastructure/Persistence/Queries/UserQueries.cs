using Application.Common.Interfaces.Queries;
using Domain.Products;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Queries
{
    public class UserQueries : IUserQueries
    {
        private readonly ApplicationDbContext _context;
        public UserQueries(ApplicationDbContext context)
        {
            _context = context;
        }
       /* public async Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Users
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }*/

       /* public async Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            var entity = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id.Equals(id), cancellationToken);

            return entity;
        }*/
    }
}
