using Domain.Containers;
using Domain.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ContainerHistories
{
    public class ContainerHistory
    {
        public ContainerHistoryId Id { get; }
        public ContainerId ContainerId { get; }
        public ProductId ProductId { get; }
        public DateTime FullingDate { get; }
        public DateTime CleaningDate { get; }
        private ContainerHistory(ContainerHistoryId id, ContainerId containerId, ProductId productId, DateTime fullingDate, DateTime cleaningDate)
        {
            Id = id;
            ContainerId = containerId;
            ProductId = productId;
            FullingDate = fullingDate;
            CleaningDate = cleaningDate;
        }
        public static ContainerHistory CreateNew(ContainerHistoryId id,ContainerId containerId, ProductId productId, DateTime fullingDate, DateTime cleaningDate)
        {
            return new ContainerHistory(id, containerId, productId, fullingDate, cleaningDate);
        }
    }
}
