using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ProductTypes
{
    public class ProductType
    {
        public ProductTypeId Id { get; }
        public string Name { get; set; }

        public ProductType(ProductTypeId id, string name)
        {
            Id = id;
            Name = name;
        }

        public static ProductType Create(ProductTypeId id, string name)
        {
            return new ProductType(id, name);
        }
        public void Update(string name)
        {
            Name = name;
        }

    }
}
