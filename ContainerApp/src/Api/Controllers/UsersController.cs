using Api.Dtos;
using Application.Common.Interfaces.Queries;
using Application.Entities.Users.Commands;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;

namespace Api.Controllers
{
    [Authorize]
    [Route("api/users")]
    [ApiController]
    public class UsersController(
        IGetQueries<User> userQueries,
        ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<UserDto>>> GetUsers(CancellationToken cancellationToken)
        {
            var users = await userQueries.GetAllAsync(cancellationToken);

            return users.Select(UserDto.FromDomain).ToList();
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateUser(
            [FromBody] CreateUserDto request,
            CancellationToken cancellationToken)
        {
            var command = new CreateUsersCommand
            {
                Name = request.Name,
                Surname = request.Surname,
                Middlename = request.Middlename,
                Email = request.Email,
                Role = request.Role,
             //   Identifier = request.Identifier,
                IsApproved = request.IsApproved
            };

            var userId = await sender.Send(command, cancellationToken);

            return Ok(userId);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<UserDto>> UpdateUser(
            [FromRoute] int id,
            [FromBody] UpdateUserDto request,
            CancellationToken cancellationToken)
        {
            var command = new UpdateUsersCommand
            {
                Id = id,
                Name = request.Name,
                Surname = request.Surname,
                Middlename = request.Middlename,
                Email = request.Email
               // Identifier = request.Identifier
            };

            var updatedUser = await sender.Send(command, cancellationToken);

            return Ok(UserDto.FromDomain(updatedUser));
        }


        [HttpPatch("{id:int}/role")]
        public async Task<ActionResult> ChangeUserRole(
            [FromRoute] int id,
            [FromBody] ChangeUserRoleDto request,
            CancellationToken cancellationToken)
        {
            var command = new UpdateUserRolesCommand
            {
                Id = id,
                Role = request.NewRole
            };

            await sender.Send(command, cancellationToken);

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteUser(
            [FromRoute] int id,
            CancellationToken cancellationToken)
        {
            var command = new DeleteUsersCommand
            {
                Id = id
            };

            await sender.Send(command, cancellationToken);

            return NoContent();
        }
    }
}
