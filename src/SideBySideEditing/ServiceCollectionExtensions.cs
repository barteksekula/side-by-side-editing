using System;
using System.Linq;
using EPiServer.Shell.Modules;
using Microsoft.Extensions.DependencyInjection;

namespace SideBySideEditing
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddSideBySideEditing(this IServiceCollection services)
        {
            services.Configure<ProtectedModuleOptions>(
                pm =>
                {
                    if (!pm.Items.Any(i =>
                        i.Name.Equals("side-by-side-editing", StringComparison.OrdinalIgnoreCase)))
                    {
                        pm.Items.Add(new ModuleDetails { Name = "side-by-side-editing" });
                    }
                });

            return services;
        }
    }
}