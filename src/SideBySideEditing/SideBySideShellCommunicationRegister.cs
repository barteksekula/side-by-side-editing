using EPiServer.Framework.Web.Resources;
using EPiServer.ServiceLocation;
using EPiServer.Shell;
using EPiServer.Web;

namespace SideBySideEditing;

[ClientResourceRegistrator]
public class SideBySideShellCommunicationRegister : IClientResourceRegistrator
{
    private readonly IContextModeResolver _contextModeResolver;

    public SideBySideShellCommunicationRegister()
        : this(ServiceLocator.Current.GetInstance<IContextModeResolver>())
    {
    }

    public SideBySideShellCommunicationRegister(IContextModeResolver contextModeResolver)
    {
        _contextModeResolver = contextModeResolver;
    }

    public void RegisterResources(IRequiredClientResourceList requiredResources)
    {
        InternalRegisterResources(requiredResources);
    }

    private void InternalRegisterResources(IRequiredClientResourceList requiredResources)
    {
        var contextMode = _contextModeResolver.CurrentMode;
        if (contextMode is ContextMode.Edit or ContextMode.Preview)
        {
            requiredResources.RequireScript(Paths.ToClientResource(GetType().Assembly, "ClientResources/AutoRefresher.js")).AtFooter();
        }
    }
}
