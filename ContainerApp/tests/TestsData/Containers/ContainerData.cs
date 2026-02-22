using Domain.Containers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestsData.Containers
{
    public class ContainerData
    {
        public static Container EmptyContainer()
        => Container.CreateNew(
            name: "Цистерна-А1",
            description: "Основна цистерна для рідин",
            uniqCode: "TNK-001",
            typeId: 1
        );

        public static Container FilledContainer()
        {
            var container = Container.CreateNew(
                name: "Цистерна-Б2",
                description: "Заповнена тестова цистерна",
                uniqCode: "TNK-002",
                typeId: 1
            );  
            //container.FillContainer(1, 1, 450);
            return container;
        }
    }
}
