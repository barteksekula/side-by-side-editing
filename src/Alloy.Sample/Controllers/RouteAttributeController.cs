using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Alloy.Sample.Controllers
{
    public class RouteAttributeController : ControllerBase
    {
        public const string AttributeRoute = "goto-foo";

        [Route(AttributeRoute)]
        public IActionResult Index() => Content("bar");
    }
}
