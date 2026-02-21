using Domain.Containers;
using Domain.ContainerTypes;
using Domain.ProductTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Products
{
    public class Product : IEntity
    {
        public int Id { get; }

        public int ProductTypeId { get; private set; }
        public ProductType ProductType { get; private set; }

        public string Name { get; private set; }
        public DateTime ExpirationDate { get; private set; }
        public DateTime? ManufactureDate { get; private set; }
        public string Description { get; private set; }
        public bool IsDeleted { get; private set; }

        public int? LastModifiedBy { get; private set; }
        public DateTime? LastModifiedAt { get; private set; }


        private Product(int id, int productTypeId, string name, DateTime expirationDate, DateTime? manufactureDate, string description)
        {
            Id = id;
            ProductTypeId = productTypeId;
            Name = name;
            ExpirationDate = expirationDate;
            ManufactureDate = manufactureDate;
            Description = description;
        }

        public static Product Create(
            int id,
            int productTypeId,
            string name,
            DateTime expirationDate,
            DateTime? manufactureDate,
            string description)
        {
            return new Product(
                id,
                productTypeId,
                name,
                expirationDate,
                manufactureDate,
                description);
        }

        public void Update(
            string name,
            DateTime expirationDate,
            DateTime? manufactureDate,
            string description,
            int userId)
        {
            Name = name;
            ExpirationDate = expirationDate;
            ManufactureDate = manufactureDate;
            Description = description;
            LastModifiedAt = DateTime.UtcNow;
            LastModifiedBy = userId;
        }
        public void MarkAsDeleted(int userId)
        {
            IsDeleted = true;
            LastModifiedAt = DateTime.UtcNow;
            LastModifiedBy = userId;
        }
    }
}
