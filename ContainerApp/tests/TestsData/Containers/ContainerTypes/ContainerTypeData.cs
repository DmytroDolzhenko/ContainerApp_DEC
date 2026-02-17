using Domain.ContainerTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestsData.Containers.ContainerTypes
{
    public class ContainerTypeData
    {
        public static ContainerType TankContainerType()
        => new ContainerType(
            id: 1,
            name: "Цистерна",
            createdAt: DateTime.UtcNow.AddMonths(-1)
        );
    }
}
