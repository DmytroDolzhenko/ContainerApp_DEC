using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ContainerTypes
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
        public static ContainerType CreateNew(string name)
        {
            return new ContainerType(ContainerTypeId.New(), name);
        }
        public void UpdateDetails(string name)
        {
            Name = name;
        }
    }
}
