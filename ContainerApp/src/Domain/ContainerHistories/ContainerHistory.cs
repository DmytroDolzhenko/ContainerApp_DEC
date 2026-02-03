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
        public int Id { get; }
        public int ContainerId { get; }
        public int? ProductId { get; }
        public string Action { get; }
        public DateTime UpdatedAt { get; }
        public int UserId { get; }

        private ContainerHistory(int id, int containerId, int productId, string action, int userId, DateTime updatedAt)
        {
            Id = id;
            ContainerId = containerId;
            ProductId = productId;
            Action = action;
            UserId = userId;
            UpdatedAt = updatedAt;
        }
        public static ContainerHistory CreateNew(int containerId, int productId, string action, int userId, DateTime dateTime)
        {
            return new ContainerHistory(0, containerId, productId, action, userId, DateTime.UtcNow);
        }
    }
}
