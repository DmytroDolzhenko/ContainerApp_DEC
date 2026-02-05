using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Products;
using MediatR;

namespace Application.Products.Commands
{
    public record DeleteProductsCommand : IRequest
    {
        public required int Id { get; init; }
    }

    public class DeleteProductCommandHandler(
        IEntityRepository<Product> repository, IGetQueries<Product> queries)
        : IRequestHandler<DeleteProductsCommand>
    {
        public async Task Handle(
            DeleteProductsCommand request,
            CancellationToken cancellationToken)
        {
            var product = await queries.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (product is null)
            {
                throw new KeyNotFoundException(
                    $"Product with id {request.Id} not found");
            }

            await repository.DeleteAsync(product, cancellationToken);
        }
    }
}