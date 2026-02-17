using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Tests.Common;
using Xunit;

namespace Api.Tests.Integration.User
{
    public class UserControllerTest(IntegrationTestWebFactory factory) : BaseIntegrationTest(factory)
    {
        private readonly Domain.Users.User _firstTestUser = TestsData.Users.UserData.AdminUser();
        private readonly Domain.Users.User _secondTestUser = TestsData.Users.UserData.Operator();

        private const string AdminRoute = "api/admin/users";
        private const string BaseRoute = "api/users";

        [Fact]
        public async Task ShouldCreateUser()
        {
            var request = new
            {
                Name = _firstTestUser.Name,
                Surname = _firstTestUser.Surname,
                Middlename = _firstTestUser.Middlename,
                Email = _firstTestUser.Email,
                Role = _firstTestUser.Role.ToString(),
                IsApproved = _firstTestUser.IsApproved
            };
            var response = await Client.PostAsJsonAsync(BaseRoute, request);
            response.EnsureSuccessStatusCode();
            var createdUserId = await response.ToResponseModel<int>();
            Assert.True(createdUserId > 0);
        }
    }
}
