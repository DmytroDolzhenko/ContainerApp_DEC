using Application.Common.Interfaces.Repositories;
using Domain.ContainerTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class ContainerTypeRepository : IContainerTypeRepositories
    {
        private readonly ApplicationDbContext _context;
        public ContainerTypeRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        /*public async Task<ContainerType> AddAsync(ContainerType containerType, CancellationToken cancellationToken)
        {
            await _context.ContainerTypes.AddAsync(containerType, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return containerType;
        }

        public async Task<ContainerType> DeleteAsync(ContainerType containerType, CancellationToken cancellationToken)
        {
            _context.ContainerTypes.Remove(containerType);
            await _context.SaveChangesAsync(cancellationToken);
            return containerType;
        }

        public async Task<ContainerType> UpdateAsync(ContainerType containerType, CancellationToken cancellationToken)
        {
            _context.ContainerTypes.Update(containerType);
            await _context.SaveChangesAsync(cancellationToken);
            return containerType;
        }*/
    }
}
