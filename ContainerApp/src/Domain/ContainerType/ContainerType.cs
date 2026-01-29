using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ContainerType
{
    public class ContainerType
    {
        public ContainerTypeId Id { get; }
        public string Name { get; private set; }
        public ContainerType(ContainerTypeId id, string name)
        {
            Id = id;
            Name = name;
        }
        public static ContainerType CreateNew(ContainerTypeId id,string name)
        {
            return new ContainerType(id, name);
        }
        public void UpdateDetails(string name)
        {
            Name = name;
        }
    }
}
