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
    public class ContainerHistory : IEntity
    {
        public int Id { get; }
        public int ContainerId { get; private set; }
        public int? ProductId { get; private set; }
        public string Action { get; private set; }
        public DateTime UpdatedAt { get; private set; }
        public int UserId { get; private set; }

        private ContainerHistory(int id, int containerId, int? productId, string action, int userId, DateTime updatedAt)
        {
            Id = id;
            ContainerId = containerId;
            ProductId = productId;
            Action = action;
            UserId = userId;
            UpdatedAt = updatedAt;
        }
        public static ContainerHistory CreateNew(int containerId, int? productId, string action, int userId, DateTime dateTime)
        {
            return new ContainerHistory(0, containerId, productId, action, userId, DateTime.UtcNow);
        }
    }
}
