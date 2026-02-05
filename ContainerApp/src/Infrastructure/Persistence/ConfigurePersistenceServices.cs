using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Infrastructure.Persistence.Queries;
using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence
{
    public static class ConfigurePersistenceServices
    {
        public static void AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            var dataSourceBuilder = new NpgsqlDataSourceBuilder(configuration.GetConnectionString("DefaultConnection"));
            dataSourceBuilder.EnableDynamicJson();
            var dataSource = dataSourceBuilder.Build();

            services.AddDbContext<ApplicationDbContext>(options => options
                .UseNpgsql(
                    dataSource,
                    builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName))
                .UseSnakeCaseNamingConvention()
                .ConfigureWarnings(w => w.Ignore(CoreEventId.ManyServiceProvidersCreatedWarning)));

            services.AddScoped<ApplicationDbContextInitialiser>();
            services.AddRepositories();
        }

        private static void AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<UserRepository>();
            services.AddScoped<UserQueries>();
            services.AddScoped<IUserRepository>(provider => provider.GetRequiredService<UserRepository>());
            services.AddScoped<IUserQueries>(provider => provider.GetRequiredService<UserQueries>());

            services.AddScoped<ProductRepository>();
            services.AddScoped<ProductQueries>();
            services.AddScoped<IProductRepository>(provider => provider.GetRequiredService<ProductRepository>());
            services.AddScoped<IProductQueries>(provider => provider.GetRequiredService<ProductQueries>());

            services.AddScoped<ProductTypeRepository>();
            services.AddScoped<ProductTypeQueries>();
            services.AddScoped<IProductTypeRepository>(provider => provider.GetRequiredService<ProductTypeRepository>());
            services.AddScoped<IProductTypeQueries>(provider => provider.GetRequiredService<ProductTypeQueries>());

            services.AddScoped<ContainerRepository>();
            services.AddScoped<ContainerQueries>();
            services.AddScoped<IContainerRepositories>(provider => provider.GetRequiredService<ContainerRepository>());
            services.AddScoped<IContainerQueries>(provider => provider.GetRequiredService<ContainerQueries>());

            services.AddScoped<ContainerTypeRepository>();
            services.AddScoped<ContainerTypeQueries>();
            services.AddScoped<IContainerTypeRepositories>(provider => provider.GetRequiredService<ContainerTypeRepository>());
            services.AddScoped<IContainerTypeQueries>(provider => provider.GetRequiredService<ContainerTypeQueries>());

            services.AddScoped<ContainerHistoryRepository>();
            services.AddScoped<ContainerHistoryQueries>();

            //services.AddScoped<IContainerHistoryRepository>(provider => provider.GetRequiredService<ContainerHistoryRepository>());
            //services.AddScoped<IContainerHistoryQueries>(provider => provider.GetRequiredService<ContainerHistoryQueries>());

            //реєструємо EntityRepository та GetQueries для всіх сутностей

        }
    }
}
