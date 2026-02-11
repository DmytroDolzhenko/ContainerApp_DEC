using Domain.Containers;
using Domain.ContainerTypes;
using Domain.ProductTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ContainerTypeProductTypes
{
    public class ContainerTypeProductType : IEntity
    {
        public int Id { get; }
        public int ContainerTypeId { get; set; }
        public ContainerType? ContainerType { get; set; }

        public int ProductTypeId { get; set; }
        public ProductType? ProductType { get; set; }


        public ContainerTypeProductType(int containerTypeId, int productTypeId)
        {
            ContainerTypeId = containerTypeId;
            ProductTypeId = productTypeId;
        }
    }
}
