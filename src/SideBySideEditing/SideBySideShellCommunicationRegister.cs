using EPiServer.Framework.Web.Resources;
using EPiServer.ServiceLocation;
using EPiServer.Shell;
using EPiServer.Web;

namespace SideBySideEditing;

[ClientResourceRegistrator]
public class SideBySideShellCommunicationRegister : IClientResourceRegistrator
{
    private readonly IContextModeResolver _contextModeResolver;
    private readonly SideBySideEditingOptions _sideBySideEditingOptions;

    public SideBySideShellCommunicationRegister()
        : this(ServiceLocator.Current.GetInstance<IContextModeResolver>(), ServiceLocator.Current.GetInstance<SideBySideEditingOptions>())
    {
    }

    public SideBySideShellCommunicationRegister(IContextModeResolver contextModeResolver, SideBySideEditingOptions sideBySideEditingOptions)
    {
        _contextModeResolver = contextModeResolver;
        _sideBySideEditingOptions = sideBySideEditingOptions;
    }

    public void RegisterResources(IRequiredClientResourceList requiredResources)
    {
        InternalRegisterResources(requiredResources);
    }

    private void InternalRegisterResources(IRequiredClientResourceList requiredResources)
    {
        if (!_sideBySideEditingOptions.RegisterIframeAutoRefresher)
        {
            return;
        }

        var contextMode = _contextModeResolver.CurrentMode;
        if (contextMode is ContextMode.Edit or ContextMode.Preview)
        {
            requiredResources.RequireScript(Paths.ToClientResource(GetType().Assembly, "ClientResources/AutoRefresher.js")).AtFooter();
        }
    }
}
