using Domain.Containers;
using Domain.Products;
using Domain.Users;
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
        public ProductId? ProductId { get; }
        public string Action { get; }
        public DateTime UpdatedAt { get; }
        public UserId UserId { get; }

        private ContainerHistory(ContainerHistoryId id, ContainerId containerId, ProductId productId, string action, UserId userId, DateTime updatedAt)
        {
            Id = id;
            ContainerId = containerId;
            ProductId = productId;
            Action = action;
            UserId = userId;
            UpdatedAt = updatedAt;
        }
        public static ContainerHistory CreateNew(ContainerId containerId, ProductId productId, string action, UserId userId, DateTime dateTime)
        {
            return new ContainerHistory(ContainerHistoryId.New(), containerId, productId, action, userId, DateTime.UtcNow);
        }
    }
}
