using System.Linq;
using Alloy.Sample.Controllers;
using Alloy.Sample.Models.Pages;
using Alloy.Sample.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Alloy.Sample.Controllers
{
    public class SearchPageController : PageControllerBase<SearchPage>
    {
        public ViewResult Index(SearchPage currentPage, string q)
        {
            var model = new SearchContentModel(currentPage)
            {
                Hits = Enumerable.Empty<SearchContentModel.SearchHit>(),
                NumberOfHits = 0,
                SearchServiceDisabled = true,
                SearchedQuery = q
            };

            return View(model);
        }
    }
}
