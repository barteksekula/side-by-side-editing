using System.IO;
using EPiServer.Framework.Hosting;
using EPiServer.Web.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace Alloy.Sample
{
    internal static class InternalServiceCollectionExtensions
    {
        /// <internal-api/>
        public static IServiceCollection AddUIMappedFileProviders(this IServiceCollection services, string applicationRootPath, string uiSolutionRelativePath)
        {
            var uiSolutionFolder = Path.Combine(applicationRootPath, uiSolutionRelativePath);
            services.Configure<CompositeFileProviderOptions>(c =>
            {
                c.BasePathFileProviders.Add(new MappingPhysicalFileProvider("/EPiServer/side-by-side-editing", string.Empty, Path.Combine(uiSolutionFolder, @"src\SideBySideEditing")));
            });
            return services;
        }
    }
}
