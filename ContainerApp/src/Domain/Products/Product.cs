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
        public int TypeId { get; }
        public string Name { get; private set; }
        public double Capacity { get; private set; }
        public DateTime ExpirationDate { get; private set; }
        public DateTime? FullingDate { get; private set; }
        public string Description { get; private set; }

        private Product(int id, int type_id, string name, double capacity , DateTime expirationDate, DateTime? fullingDate, string description)
        {
            Id = id;
            TypeId = type_id;
            Name = name;
            Capacity = capacity;
            ExpirationDate = expirationDate;
            FullingDate = fullingDate;
            Description = description;
        }

        public static Product Create(
            int id,
            int typeId,
            string name,
            double capacity,
            DateTime expirationDate,
            string description)
        {
            return new Product(
                id,
                typeId,
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
            DateTime? fullingDate,
            string description)
        {
            Name = name;
            Capacity = capacity;
            ExpirationDate = expirationDate;
            FullingDate = fullingDate;
            Description = description;
        }
    }
}
