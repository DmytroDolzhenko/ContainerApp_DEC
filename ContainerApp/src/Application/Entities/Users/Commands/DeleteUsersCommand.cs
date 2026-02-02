using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Users;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Users.Commands
{
    public record DeleteUsersCommand : IRequest
    {
        public required UserId Id { get; init; }
    }

    public class DeleteUsersCommandHandler(
        IUserRepository repository, IUserQueries queries)
        : IRequestHandler<DeleteUsersCommand>
    {
        public async Task Handle(
            DeleteUsersCommand request,
            CancellationToken cancellationToken)
        {
            var user = await queries.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (user is null)
            {
                throw new KeyNotFoundException(
                    $"Product with id {request.Id} not found");
            }

            await repository.DeleteAsync(user, cancellationToken);
        }
    }
}
