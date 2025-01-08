using EPiServer.Core;
using EPiServer.ServiceLocation;
using EPiServer.Shell;

namespace SideBySideEditing;

[ServiceConfiguration(typeof(ViewConfiguration))]
public class SideBySideEditing : ViewConfiguration<IContentData>
{
    private const string SideBySideEditView = "sidebysideedit";

    public SideBySideEditing()
    {
        Key = SideBySideEditView;
        ControllerType = "side-by-side-editing/SideBySideController";
        LanguagePath = "/sidebysideediting";
        ViewType = "side-by-side-editing/SideBySideEditingView";
        IconClass = "epi-iconCompare";
        SortOrder = 300;
    }
}
