using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Users.Commands
{
    public record UpdateUserRolesCommand : IRequest<bool>
    {
        public required int Id { get; init; }
        public required UserRole Role { get; init; }

    }

    public class UpdateUsersRolesCommand(
        IGetQueries<User> queries,
        UserManager<User> userManager,
        ICurrentUserService userContext)
        : IRequestHandler<UpdateUserRolesCommand, bool>
    {
        public async Task<bool> Handle
            (UpdateUserRolesCommand request,
            CancellationToken cancellationToken)
        {
            var currentUserId = userContext.UserId;

            if (currentUserId.HasValue && request.Id == currentUserId.Value)
            {
                throw new InvalidOperationException("Ви не можете змінити роль самому собі.");
            }

            var user = await queries.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (user == null)
            {
                throw new InvalidOperationException($"User with id {request.Id} not found.");
            }

            user.ChangeRole(request.Role);

            var result = await userManager.UpdateAsync(user);

            return result.Succeeded;
        }
    }
}
