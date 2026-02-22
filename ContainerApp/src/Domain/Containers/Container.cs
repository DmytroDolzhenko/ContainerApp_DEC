using Domain.ContainerRules;
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
        public int TypeId { get; private set; }
        public ContainerType? Type { get; private set; }

        public int? ProductId { get; private set; }
        public Product? Product { get; private set; }

        public string Name { get; private set; }
        public double Capacity => Type?.Capacity ?? 0;
        public double CurrentCapacity { get; private set; }
        public string Description { get; private set; }
        public string UniqCode { get; private set; }
        public bool Status { get; private set; }
        public DateTime CreatedAt { get; }
        public int? LastModifiedBy { get; private set; }
        public DateTime? LastModifiedAt { get; private set; }
        public bool IsDeleted { get; private set; }
        public List<ContainerRule> Rules { get; private set; } = new();
        public Container(int id, string name, string description, string uniqCode, int typeId, DateTime createdAt)
        {
            Id = id;
            TypeId = typeId;
            Name = name;
            Description = description;
            UniqCode = uniqCode;
            Status = false;
            CreatedAt = createdAt;
        }
        public static Container CreateNew(string name, string description, string uniqCode, int typeId)
        {
            return new Container(0, name, description, uniqCode, typeId, DateTime.UtcNow);
        }
        public void UpdateDetails(int id, string name, string description, int typeId, int updatedBy)
        {
            Name = name;
            Description = description;
            TypeId = typeId;
            LastModifiedBy = updatedBy;
        }
        public void FillContainer(Product product, int userId, int amount)
        {
            if (Status == true)
            {
                throw new InvalidOperationException("Container is already filled.");
            }

            if (Rules.Any() && !Rules.Any(r => r.ProductTypeId == product.ProductTypeId))
            {
                throw new InvalidOperationException($"Product type {product.ProductType?.Name} is not allowed in this container.");
            }

            if (amount > Capacity)
            {
                throw new InvalidOperationException("Amount exceeds container capacity.");
            }

            ProductId = product.Id;
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
        public void MarkAsDeleted(int userId)
        {
            IsDeleted = true;
            LastModifiedBy = userId;
            LastModifiedAt = DateTime.UtcNow;
        }
        public void AddRule(int productTypeId)
        {
            if (Rules.Any(r => r.ProductTypeId == productTypeId))
            {
                throw new InvalidOperationException("Rule already exists for this container.");
            }

            var rule = ContainerRule.CreateNew(productTypeId, Id);

            Rules.Add(rule);
        }
        public void RemoveRule(int ruleId)
        {
            var rule = Rules.FirstOrDefault(r => r.Id == ruleId);

            if (rule == null)
            {
                throw new KeyNotFoundException($"Rule with Id {ruleId} not found in this container.");
            }

            Rules.Remove(rule);
        }
    }
}