using System.Collections.Generic;
using Domain.Products;

namespace Domain.ProductTypes
{
    public class ProductType : IEntity
    {
        public int Id { get; }
        public string Name { get; private set; }

        private readonly List<Product> _products = new();
        public IReadOnlyCollection<Product> Products => _products.AsReadOnly();

        public ProductType(int id, string name)
        {
            Id = id;
            Name = name;
        }

        public static ProductType Create(int id, string name)
        {
            return new ProductType(id, name);
        }

        public void Update(string name)
        {
            Name = name;
        }
    }
}