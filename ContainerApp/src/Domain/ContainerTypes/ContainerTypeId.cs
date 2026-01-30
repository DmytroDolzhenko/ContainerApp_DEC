using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ContainerTypes
{
    public record ContainerTypeId(Guid value)
    {
        public static ContainerTypeId New() => new(Guid.NewGuid());
        public static ContainerTypeId Empty() => new(Guid.Empty);
        public override string ToString() => value.ToString();
    }
}
