using Application.Common.Interfaces.Repositories;
using Domain.Products;
using Domain.Users;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Entities.Users.Commands
{
    public record CreateUsersCommand : IRequest<User>
    {
        public required string Name { get; init; }
        public required string Surname { get; init; }
        public required string Middlename { get; init; }
        public required string Email { get; init; }
        public required UserRole Role { get; init; }
      //  public required string Identifier { get; init; }
        public required bool IsApproved { get; init; }

    }

    public class CreateUserCommandHandler(
        IEntityRepository<User> repository
    ) : IRequestHandler<CreateUsersCommand, User>
    {
        public async Task<User> Handle(
            CreateUsersCommand request,
            CancellationToken cancellationToken)
        {

            var user = User.Create(
                request.Name,
                request.Surname,
                request.Middlename,
                request.Email,
                request.Role,
           //     request.Identifier,
                request.IsApproved
            );

            await repository.AddAsync(user, cancellationToken);

            return user;
        }
    }
}
