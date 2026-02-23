using Domain.Users;

namespace Api.Dtos
{
    public record UserDto(
        int Id,
        string FullName,
        string Email,
        UserRole Role,
        bool IsApproved,
        DateTime? RegistrationDate
    )
    {
        public static UserDto FromDomain(User user)
            => new(
                user.Id,
                $"{user.Name} {user.Middlename} {user.Surname}",
                user.Email,
                user.Role,
                user.IsApproved,
                user.RegistrationDate
            );
    }

    public record CreateUserDto(
        string Name,
        string Middlename,
        string Surname,
        string Email,
        UserRole Role,
    //    string Identifier,
        bool IsApproved
    );

    public record UpdateUserDto(
        string Name,
        string Surname,
        string Middlename,
        string Email
      //  string Identifier
    );

    public record ChangeUserRoleDto(
        UserRole NewRole
    );
}
