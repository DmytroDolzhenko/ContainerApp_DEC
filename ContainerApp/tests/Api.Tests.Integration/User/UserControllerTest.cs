using System.Net.Http.Json;
using Tests.Common;
using Xunit;

namespace Api.Tests.Integration.User
{
    public class UserControllerTest : BaseIntegrationTest
    {
        private readonly HttpClient _client;

        private readonly Domain.Users.User _firstTestUser = TestsData.Users.UserData.AdminUser();
        private readonly Domain.Users.User _secondTestUser = TestsData.Users.UserData.Operator();

        private const string AdminRoute = "api/admin/users";
        private const string BaseRoute = "api/users";

        public UserControllerTest(IntegrationTestWebFactory factory) : base(factory)
        {
            _client = factory.WithWebHostBuilderMock().CreateClient();

            _client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("TestScheme");
        }

        [Fact]
        public async Task ShouldCreateUser()
        {
            var newUser = new
            {
                Name = _firstTestUser.Name,
                Email = _firstTestUser.Email,
                Password = "Password123!",
                Role = _firstTestUser.Role.ToString()
            };
            var response = await Client.PostAsJsonAsync(BaseRoute, newUser);

            if (response.StatusCode == System.Net.HttpStatusCode.InternalServerError)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Server Error Details: {error}");
            }

            Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);
        }
    }
}