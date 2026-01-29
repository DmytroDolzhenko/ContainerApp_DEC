using Domain.ContainerType;
using Domain.Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Container
{
    public class Container
    {
        public ContainerId Id { get; }
        public ContainerTypeId TypeId { get; }
        public ProductId? ProductId { get; set; }
        public string Name { get; set; }
        public string UniqCode { get; }
        public double Capacity { get; }
        public string Description { get; set; }
        public bool Status { get; set; }
    }
    
}
