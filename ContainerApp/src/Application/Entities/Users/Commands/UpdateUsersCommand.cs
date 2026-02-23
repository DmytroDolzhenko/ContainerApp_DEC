using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.ProductTypes;
using Domain.Users;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Users.Commands
{
    public record UpdateUsersCommand : IRequest<User>
    {
        public required int Id { get; init; }
        public required string Name { get; init; }
        public required string Surname { get; init; }
        public required string Middlename { get; init; }
        public required string Email { get; init; }
    }

    public class UpdateUserCommandHandler(
        IEntityRepository<User> repository,
        ICurrentUserService userContext,
        IGetQueries<User> queries)
        : IRequestHandler<UpdateUsersCommand, User>
    {
        public async Task<User> Handle(
            UpdateUsersCommand request,
            CancellationToken cancellationToken)
        {
            var currentUserId = userContext.UserId;

            if (currentUserId == null)
            {
                throw new Exception("User is not authenticated");
            }

            if (currentUserId != request.Id)
            {
                throw new Exception("User can only update their own information");
            }

            var user = await queries.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (user == null)
            {
                throw new Exception($"User with id {request.Id} not found");
            }

            user.Update(
                request.Name,
                request.Surname,
                request.Middlename,
                request.Email
                );

            await repository.UpdateAsync(user, cancellationToken);

            return user;
        }
    }
}
