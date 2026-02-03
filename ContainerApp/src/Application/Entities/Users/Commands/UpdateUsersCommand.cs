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
        public required string Identifier { get; init; }
        public required DateTime RegistrationDate { get; init; }

    }

    public class UpdateUserCommandHandler(
        IUserRepository repository,
        IUserQueries queries)
        : IRequestHandler<UpdateUsersCommand, User>
    {
        public async Task<User> Handle(
            UpdateUsersCommand request,
            CancellationToken cancellationToken)
        {
            var user = await queries.GetByIdAsync(
                request.Id,
                cancellationToken);

            user.Update(
                request.Name,
                request.Surname,
                request.Middlename,
                request.Email,
                request.Identifier
                );

            await repository.UpdateAsync(user, cancellationToken);

            return user;
        }
    }
}
