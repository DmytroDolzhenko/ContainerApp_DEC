using Application.Common.Interfaces;
using Application.Common.Interfaces.Repositories;
using Domain.ContainerHistories;
using Domain.Products;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Behaviours
{
/*    public class ContainerHistoryBehavior<TRequest, TResponce>
        (IEntityRepository<ContainerHistory> historyRepositories)
        : IPipelineBehavior<TRequest, TResponce>
        where TRequest : IContainerHistoryWritter
    {
        public async Task<TResponce> Handle
            (TRequest request,
            RequestHandlerDelegate<TResponce> next,
            CancellationToken cancellationToken)
        {
            var responce = await next();

            var history = ContainerHistory.CreateNew(
                request.ContainerId,
                request.ProductId,
                request.ActionDescription,
                request.UserId,
                DateTime.UtcNow);

            await historyRepositories.AddAsync(history, cancellationToken);
            return responce;
        }
    }*/
}
