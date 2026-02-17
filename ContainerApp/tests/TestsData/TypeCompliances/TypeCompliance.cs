using Domain.ContainerTypeProductTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestsData.TypeCompliances
{
    public class TypeCompliance
    {
        public static ContainerTypeProductType TankLiquidMapping()
        => new ContainerTypeProductType(
            containerTypeId: 1,
            productTypeId: 1
        );
    }
}
