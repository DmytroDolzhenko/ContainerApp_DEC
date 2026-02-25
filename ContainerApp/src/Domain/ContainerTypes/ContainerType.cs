using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ContainerTypes
{
    public class ContainerType : IEntity
    {
        public int Id { get; }
        public string Name { get; private set; }
        public int Capacity { get; private set; }
        public DateTime CreatedAt { get; }
        public DateTime? UpdatedAt { get; private set; }
        public bool IsDeleted { get; private set; }
        public ContainerType(int id, string name, int capacity, DateTime createdAt)
        {
            Id = id;
            Name = name;
            Capacity = capacity;
            CreatedAt = createdAt;
        }
        public static ContainerType CreateNew(string name, int capacity)
        {
            return new ContainerType(0, name, capacity, DateTime.UtcNow);
        }
        public void UpdateDetails(string name, int capacity)
        {
            Name = name;
            Capacity = capacity;
            UpdatedAt = DateTime.UtcNow;
        }
        public void MarkAsDeleted()
        {
            IsDeleted = true;
            UpdatedAt = DateTime.UtcNow;
        }
        public void MarkAsUndeleted()
        {
            IsDeleted = false;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
