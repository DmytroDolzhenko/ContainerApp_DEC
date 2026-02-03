using Domain.Containers;
using Domain.Products;
using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IAuditableContainerCommand
    {
        ContainerId ContainerId { get; }
        int? ProductId { get; }
        int UserId { get; }
        string ActionDescription { get; }
    }
}
