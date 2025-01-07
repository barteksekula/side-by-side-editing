using System;
using Alloy.Sample;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Alloy.Sample.Infrastructure
{
    [AttributeUsage(AttributeTargets.Class, Inherited = true)]
    public class RegisterFirstAdminWithLocalRequestAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (AdministratorRegistrationPageMiddleware.IsEnabled == false)
            {
                context.Result = new NotFoundResult();
                return;
            }
        }
    }
}
