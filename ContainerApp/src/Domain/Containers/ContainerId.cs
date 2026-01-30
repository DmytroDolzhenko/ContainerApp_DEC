using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Containers
{
    public record ContainerId(Guid value)
    {
        public static ContainerId New() => new(Guid.NewGuid());
        public static ContainerId Empty() => new(Guid.Empty);
        public override string ToString() => value.ToString();
    }
}
