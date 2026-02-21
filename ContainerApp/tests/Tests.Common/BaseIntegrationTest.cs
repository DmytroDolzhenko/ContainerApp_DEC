using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Tests.Common
{
    public abstract class BaseIntegrationTest : IClassFixture<IntegrationTestWebFactory>, IAsyncLifetime
    {
        protected readonly ApplicationDbContext Context;
        protected readonly HttpClient Client;
            
        protected BaseIntegrationTest(IntegrationTestWebFactory factory)
        {
            var scope = factory.Services.CreateScope();

            Context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            Client = factory.WithWebHostBuilderMock()
                .CreateClient(new WebApplicationFactoryClientOptions
                {
                    AllowAutoRedirect = false
                });

            Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(scheme: "TestScheme");
        }

        public virtual async Task DisposeAsync()
        {
            await ResetDatabaseAsync();
        }

        public virtual Task InitializeAsync() => Task.CompletedTask;

        protected async Task SaveChangesAsync()
        {
            await Context.SaveChangesAsync();
            Context.ChangeTracker.Clear();
        }

        protected async Task ResetDatabaseAsync()
        {
            Context.Containers.RemoveRange(Context.Containers);
            await Context.SaveChangesAsync();

            Context.ContainerTypes.RemoveRange(Context.ContainerTypes);
            await Context.SaveChangesAsync();

            Context.Products.RemoveRange(Context.Products);
            await Context.SaveChangesAsync();

            Context.ProductTypes.RemoveRange(Context.ProductTypes);
            await Context.SaveChangesAsync();

            Context.Users.RemoveRange(Context.Users);
            await Context.SaveChangesAsync();

            Context.ContainerTypeProductType.RemoveRange(Context.ContainerTypeProductType);
            await Context.SaveChangesAsync();

            Context.ContainerHistory.RemoveRange(Context.ContainerHistory);
            await Context.SaveChangesAsync();
        }
    }
}
