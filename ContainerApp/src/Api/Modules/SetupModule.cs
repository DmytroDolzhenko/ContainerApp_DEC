using Api.Filters;
using Application.Common.Settings;
using Application.Entities.Containers.Commands;
using FluentValidation;
using static Api.Filters.ValidationFilter;

namespace Api.Modules
{
    public static class SetupModule
    {
        public static void SetupServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers(options =>
            {
                options.Filters.Add<ValidationFilter>();
                options.Filters.Add<ApiExceptionFilterAttribute>();
            });
            services.AddCors();
            services.AddRequestValidators();
            services.AddApplicationSettings(configuration);
        }
        private static void AddCors(this IServiceCollection services)
        {
            services.AddCors(options =>
                options.AddDefaultPolicy(policy =>
                    policy.SetIsOriginAllowed(_ => true)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()));
        }

        private static void AddRequestValidators(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblyContaining<Program>();
            services.AddValidatorsFromAssembly(typeof(FillingContainerCommand).Assembly);
        }

        private static void AddApplicationSettings(this IServiceCollection services, IConfiguration configuration)
        {
            var settings = configuration.Get<ApplicationSettings>();
            if (settings != null)
            {
                services.AddSingleton(settings);
            }
        }
    }
}
