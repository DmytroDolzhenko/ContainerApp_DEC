using Application.Common.Interfaces.Repositories;
using Domain.Products;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public async Task<User> AddAsync(User entity, CancellationToken cancellationToken)
        {
            await _context.Users.AddAsync(entity, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return entity;
        }
        public async Task<User> UpdateAsync(User entity, CancellationToken cancellationToken)
        {
            _context.Users.Update(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity;
        }

        public async Task<User> DeleteAsync(User entity, CancellationToken cancellationToken)
        {
            _context.Users.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity;
        }

    }
}
