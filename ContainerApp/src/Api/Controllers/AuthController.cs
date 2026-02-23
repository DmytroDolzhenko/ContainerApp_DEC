using Api.Dtos;
using Application.Common.Interfaces;
using Domain.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthController(UserManager<User> userManager, IJwtTokenGenerator tokenGenerator)
        {
            _userManager = userManager;
            _jwtTokenGenerator = tokenGenerator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = Domain.Users.User.Create(
                request.Name,
                request.Surname,
                request.Middlename,
                request.Email,
                UserRole.Operator,
                true);

            user.UserName = request.Email;

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { Message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
                return Unauthorized("Invalid email or password");

            if (user.IsDeleted)
            {
                return Unauthorized("Ваш акаунт було видалено.");
            }

            if (!await _userManager.CheckPasswordAsync(user, request.Password))
                return Unauthorized("Invalid email or password");

            var generatedToken = _jwtTokenGenerator.GenerateToken(user);

            return Ok(new
            {
                token = generatedToken,
                user = new { id = user.Id, fullName = user.Name, role = user.Role.ToString() }
            });
        }
    }
}
