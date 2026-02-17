using Domain.ProductTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestsData.Products.ProductTypes
{
    public class ProductTypeData
    {
        public static ProductType LiquidProductType()
        => ProductType.Create(
            id: 1,
            name: "Рідини"
        );
    }
}
