using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestsData.Users
{
    public class UserData
    {
        // --- Користувачі ---
        public static User AdminUser()
            => User.Create(
                name: "Олександр",
                surname: "Адмінський",
                middlename: "Сергійович",
                email: "admin@system.com",
                role: UserRole.Admin,
                isApproved: true
            );

        public static User Operator()
            => User.Create(
                name: "Іван",
                surname: "Петренко",
                middlename: "Васильович",
                email: "operator1@system.com",
                role: UserRole.Operator,
                isApproved: true
            );
    }
}
