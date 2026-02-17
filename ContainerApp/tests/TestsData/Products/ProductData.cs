using Domain.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestsData.Products
{
    public class ProductData
    {
        public static Product MilkProduct()
        => Product.Create(
            id: 1,
            productTypeId: 1,
            name: "Молоко 3.2%",
            expirationDate: DateTime.UtcNow.AddDays(7),
            description: "Свіже пастеризоване молоко"
        );
    }
}
