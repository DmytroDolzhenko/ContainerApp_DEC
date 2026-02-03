using Domain.ContainerTypes;
using Domain.Products;
using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Containers
{
    public class Container
    {
        public ContainerId Id { get; } //change to int value
        public ContainerTypeId TypeId { get; }
        public ProductId? ProductId { get; private set; }
        public string Name { get; private set; }
        public double Capacity { get; private set; }
        public double CurrentCapacity { get; private set; }
        public string Description { get; private set; }
        public bool Status { get; private set; }
        public DateTime CreatedAt { get; }
        public UserId? LastModifiedBy { get; private set; }
        public DateTime? LastModifiedAt { get; private set; }
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
        public void FillContainer(ProductId productId, UserId userId, int amount)
        {
            if (Status == true)
            {
                throw new InvalidOperationException("Container is already filled.");
            }
            if (amount > Capacity)
            {
                throw new InvalidOperationException("Amount exceeds container capacity.");
            }

            this.ProductId = productId;
            this.Status = true;
            this.CurrentCapacity = amount;
            this.LastModifiedBy = userId;
            this.LastModifiedAt = DateTime.UtcNow;
        }
        public void CleanContainer(UserId userId)
        {
            if (Status == false)
            {
                throw new InvalidOperationException("Container is already empty.");
            }
            this.ProductId = null;
            this.Status = false;
            this.CurrentCapacity = 0;
            this.LastModifiedBy = userId;
            this.LastModifiedAt = DateTime.UtcNow;
        }
    }
}