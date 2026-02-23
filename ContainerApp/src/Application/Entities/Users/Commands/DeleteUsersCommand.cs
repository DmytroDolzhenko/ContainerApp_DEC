using Application.Common.Interfaces;
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
        public required int Id { get; init; }
    }

    public class DeleteUsersCommandHandler(
        IEntityRepository<User> repository,
        ICurrentUserService userContext,
        IGetQueries<User> queries)
        : IRequestHandler<DeleteUsersCommand>
    {
        public async Task Handle(
            DeleteUsersCommand request,
            CancellationToken cancellationToken)
        {
            var currentUserId = userContext.UserId;

            if (currentUserId is null)
            {
                throw new UnauthorizedAccessException(
                    "User must be authenticated to delete a user");
            }

            if(currentUserId == request.Id)
                {
                throw new InvalidOperationException(
                    "Users cannot delete themselves");
            }

            var user = await queries.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (user is null)
            {
                throw new KeyNotFoundException(
                    $"User with id {request.Id} not found");
            }

            user.MarkAsDeleted();
            await repository.UpdateAsync(user, cancellationToken);
        }
    }
}
