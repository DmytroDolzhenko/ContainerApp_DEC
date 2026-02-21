using Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Testcontainers.PostgreSql;
using Xunit;

namespace Tests.Common
{
    public class IntegrationTestWebFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
            .WithImage("postgres:latest")
            .WithDatabase("test-container-database")
            .WithUsername("postgres")
            .WithPassword("postgres")
            .Build();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");

            builder.ConfigureAppConfiguration((_, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["ConnectionStrings:DefaultConnection"] = _dbContainer.GetConnectionString()
                });
            });

            builder.ConfigureTestServices(services =>
            {
                // 1. Очищення реєстрацій БД
                services.RemoveServiceByType(typeof(DbContextOptions<ApplicationDbContext>));
                services.RemoveServiceByType(typeof(NpgsqlDataSource));

                // 2. Налаштування тестової БД
                var connectionString = _dbContainer.GetConnectionString();
                var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
                dataSourceBuilder.EnableDynamicJson();
                var dataSource = dataSourceBuilder.Build();

                services.AddSingleton(dataSource);
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseNpgsql(dataSource)
                           .UseSnakeCaseNamingConvention());

                services.AddScoped<ApplicationDbContextInitialiser>();

                // 3. ФІКС JSON (Використовуємо повні імена, щоб уникнути помилки JsonSerializerOptions)

                // Для MVC контролерів
                services.Configure<Microsoft.AspNetCore.Mvc.JsonOptions>(options =>
                {
                    options.JsonSerializerOptions.TypeInfoResolver =
                        new System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver();
                });

                // Для Minimal APIs
                services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
                {
                    options.SerializerOptions.TypeInfoResolver =
                        new System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver();
                });
            });
        }

        public async Task InitializeAsync()
        {
            await _dbContainer.StartAsync();

            using var scope = Services.CreateScope();
            var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();
            await initialiser.InitialiseAsync();
        }

        public new async Task DisposeAsync()
        {
            await _dbContainer.DisposeAsync();
        }
    }

    public static class TestFactoryExtensions
    {
        public static void RemoveServiceByType(this IServiceCollection services, Type servicesType)
        {
            var descriptor = services.SingleOrDefault(d => d.ServiceType == servicesType);
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }
        }
    }
}