using Domain.ContainerTypes;
using Domain.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Containers
{
    public class Container
    {
        public ContainerId Id { get; }
        public ContainerTypeId TypeId { get; }
        public ProductId? ProductId { get; private set; }
        public string Name { get; private set; }
        public double Capacity { get; private set; }
        public string Description { get; private set; }
        public bool Status { get; private set; }
        public DateTime CreatedAt { get; }
        public Container(ContainerId id, string name, double capacity, string description, ContainerTypeId typeId, DateTime createdAt)
        {
            Id = id;
            TypeId = typeId;
            Name = name;
            Capacity = capacity;
            Description = description;
            Status = false;
            CreatedAt = createdAt;
        }
        public static Container CreateNew(string name, double capacity, string description, ContainerTypeId typeId)
        {
            return new Container(ContainerId.New(), name, capacity, description, typeId, DateTime.UtcNow);
        }
        public void UpdateDetails(ContainerId id, string name, double capacity, string description)
        {
            Name = name;
            Capacity = capacity;
            Description = description;
        }
    }
}
