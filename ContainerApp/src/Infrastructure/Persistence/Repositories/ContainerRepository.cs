using Application.Common.Interfaces.Repositories;
using Domain.Containers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class ContainerRepository : IContainerRepositories
    {
        private readonly ApplicationDbContext _context;
        public ContainerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

       /* public async Task<Container> AddAsync(Container container, CancellationToken cancellationToken)
        {
            await _context.Containers.AddAsync(container, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return container;
        }

        public async Task<Container> DeleteAsync(Container container, CancellationToken cancellationToken)
        {
            _context.Containers.Remove(container);
            await _context.SaveChangesAsync(cancellationToken);
            return container;
        }

        public Task SaveChangeAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public async Task<Container> UpdateAsync(Container container, CancellationToken cancellationToken)
        {
            _context.Containers.Update(container);
            await _context.SaveChangesAsync(cancellationToken);
            return container;
        }*/
    }
}
