using Domain.ContainerHistories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestsData.ContainerHistories
{
    public class ContainerHistoryData
    {
        public static ContainerHistory FillActionHistory()
        => ContainerHistory.CreateNew(
            containerId: 1,
            productId: 1,
            action: "Fill",
            userId: 1,
            dateTime: DateTime.UtcNow
        );
    }
}
