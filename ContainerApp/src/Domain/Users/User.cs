namespace Domain.Users
{
    public class User
    {
        public UserId Id { get; }
        public string Name { get; private set; }
        public string Surname { get; private set; }
        public string Middlename { get; private set; }
        public string Email { get; private set; }
        public UserRole Role { get; private set; }
        public string Identifier {get ; private set; }
        public DateTime? RegistrationDate { get; private set; }
        public bool IsApproved { get; private set; }

        private User(
            UserId id,
            string name,
            string surname,
            string middlename,
            string email,
            UserRole role,
            string identifier,
            bool isApproved)
        {
            Id = id;
            Name = name;
            Surname = surname;
            Middlename = middlename;
            Email = email;
            Role = role;
            Identifier = identifier;
            RegistrationDate = DateTime.UtcNow;
            IsApproved = isApproved;
        }

        public static User Create(
            UserId id,
            string name,
            string surname,
            string middlename,
            string email,
            UserRole role,
            string identifier,
            bool isApproved)
        {
            return new User(
                id,
                name,
                surname,
                middlename,
                email,
                role,
                identifier,
                isApproved);
        }
        public void UpdateUser(
            string name,
            string surname,
            string middlename,
            string email,
            string identifier)
        {
            Name = name;
            Surname = surname;
            Middlename = middlename;
            Email = email;
            Identifier = identifier;
        }

        public void ChangeRole(UserRole newRole)
        {
            Role = newRole;
        }
    }

    public enum UserRole
    {
        Admin = 1,
        Operator = 2
    }
}
