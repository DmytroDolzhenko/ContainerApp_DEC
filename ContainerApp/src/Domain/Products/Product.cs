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
    public class Product
    {
        public int Id { get; }
        public int ProductTypeId { get; private set; }
        public string Name { get; private set; }
        public double Capacity { get; private set; }
        public DateTime ExpirationDate { get; private set; }
        public DateTime? ManufactureDate { get; private set; }
        public string Description { get; private set; }

        private Product(int id, int productTypeId, string name, double capacity , DateTime expirationDate, DateTime? manufactureDate, string description)
        {
            Id = id;
            ProductTypeId = productTypeId;
            Name = name;
            Capacity = capacity;
            ExpirationDate = expirationDate;
            ManufactureDate = manufactureDate;
            Description = description;
        }

        public static Product Create(
            int id,
            int productTypeId,
            string name,
            double capacity,
            DateTime expirationDate,
            string description)
        {
            return new Product(
                id,
                productTypeId,
                name,
                capacity,
                expirationDate,
                null,
                description);
        }

        public void Update(
            string name,
            double capacity,
            DateTime expirationDate,
            DateTime? manufactureDate,
            string description)
        {
            Name = name;
            Capacity = capacity;
            ExpirationDate = expirationDate;
            ManufactureDate = manufactureDate;
            Description = description;
        }
    }
}
