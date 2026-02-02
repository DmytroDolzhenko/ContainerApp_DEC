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
    public record UpdateUserRolesCommand : IRequest<User>
    {
        public required UserId Id { get; init; }
        public required UserRole Role { get; init; }

    }

    public class UpdateUsersRolesCommand(
        IUserRepository repository,
        IUserQueries queries)
        : IRequestHandler<UpdateUserRolesCommand, User>
    {
        public async Task<User> Handle(
            UpdateUserRolesCommand request,
            CancellationToken cancellationToken)
        {
            var user = await queries.GetByIdAsync(
                request.Id,
                cancellationToken);

            user.ChangeRole(request.Role);

            await repository.UpdateAsync(user, cancellationToken);


            return user;
        }
    }
}
