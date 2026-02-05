using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Queries
{
    public interface IGetQueries<T> where T : class
    {
        public Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken);

        public Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken);
    }
}
