using Api.Dtos;
using Application.Entities.ReferalLinks.Commands;
using Application.Entities.Users.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin/users")]
    public class AdminUserController
        (ISender sender)
        : ControllerBase
    {
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
            };

            var updatedUser = await sender.Send(command, cancellationToken);

            return Ok(UserDto.FromDomain(updatedUser));
        }

        [HttpPatch("{id:int}")]
        public async Task<IActionResult> ChangeUserRole(
            [FromRoute] int id,
            [FromBody] ChangeUserRoleDto request,
            CancellationToken cancellationToken)
        {
            var command = new UpdateUserRolesCommand
            {
                Id = id,
                Role = request.NewRole
            };
            var updatedUser = await sender.Send(command, cancellationToken);

            return updatedUser ? Ok() : BadRequest();
        }
        [HttpPost]
        public async Task<ActionResult<string>> CreateReferalLink()
        {
            var adminId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "id")?.Value ?? "0");
            var command = new CreateReferalLinkCommand
            {
                AdminId = adminId
            };
            var referalLink = await sender.Send(command);
            return Ok(referalLink);
        }
    }
}
