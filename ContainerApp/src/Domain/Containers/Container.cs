using Domain.ContainerTypes;
using Domain.Products;
using Domain.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Containers
{
    public class Container : IEntity
    {
        public int Id { get; }
        public int TypeId { get; }
        public ContainerType Type { get; private set; }

        public int? ProductId { get; private set; }
        public Product? Product { get; private set; }

        public string Name { get; private set; }
        public double Capacity { get; private set; }
        public double CurrentCapacity { get; private set; }
        public string Description { get; private set; }
        public bool Status { get; private set; }
        public DateTime CreatedAt { get; }
        public int? LastModifiedBy { get; private set; }
        public DateTime? LastModifiedAt { get; private set; }
        public Container(int id, string name, double capacity, string description, int typeId, DateTime createdAt)
        {
            Id = id;
            TypeId = typeId;
            Name = name;
            Capacity = capacity;
            Description = description;
            Status = false;
            CreatedAt = createdAt;
        }
        public static Container CreateNew(string name, double capacity, string description, int typeId)
        {
            return new Container(0, name, capacity, description, typeId, DateTime.UtcNow);
        }
        public void UpdateDetails(int id, string name, double capacity, string description)
        {
            Name = name;
            Capacity = capacity;
            Description = description;
        }
        public void FillContainer(int productId, int userId, int amount)
        {
            if (Status == true)
            {
                throw new InvalidOperationException("Container is already filled.");
            }
            if (amount > Capacity)
            {
                throw new InvalidOperationException("Amount exceeds container capacity.");
            }

            ProductId = productId;
            Status = true;
            CurrentCapacity = amount;
            LastModifiedBy = userId;
            LastModifiedAt = DateTime.UtcNow;
        }
        public void CleanContainer(int userId)
        {
            if (Status == false)
            {
                throw new InvalidOperationException("Container is already empty.");
            }
            ProductId = null;
            Status = false;
            CurrentCapacity = 0;
            LastModifiedBy = userId;
            LastModifiedAt = DateTime.UtcNow;
        }
    }
}