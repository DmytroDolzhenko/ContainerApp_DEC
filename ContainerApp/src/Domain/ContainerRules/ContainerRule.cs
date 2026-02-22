using Domain.ProductTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ContainerRules
{
    public class ContainerRule : IEntity
    {
        public int Id { get; set; }
        public int ProductTypeId { get; private set; }
        public ProductType ProductTypeForRule { get; private set; }

        public int ContainerId { get; private set; }

        public ContainerRule(int id, int productTypeId, int containerId)
        {
            Id = id;
            ProductTypeId = productTypeId;
            ContainerId = containerId;
        }
        public static ContainerRule CreateNew(int productTypeId, int containerId)
        {
            return new ContainerRule(0, productTypeId, containerId);
        }
    }
}
