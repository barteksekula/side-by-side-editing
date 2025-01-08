using EPiServer.ServiceLocation;

namespace SideBySideEditing;

[Options]
public class SideBySideEditingOptions
{
    public bool RegisterIframeAutoRefresher { get; set; } = true;
}
