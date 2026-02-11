namespace Api.Dtos
{
    public record RegisterRequest(string Email, string Password, string Name, string Surname, string Middlename);
    public record LoginRequest(string Email, string Password);
    public record AuthResponse(string Token, string Email);
}
