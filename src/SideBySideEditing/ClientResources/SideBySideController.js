define([
    "dojo/_base/declare",
    "dojo/Deferred",
    "dojo/when",
    "dojo/topic",
    "dojo/dom-style",
    "epi-cms/contentediting/PageDataController"
], function (
    declare,
    Deferred,
    when,
    topic,
    domStyle,
    PageDataController
) {

    return declare([PageDataController], {
        templateString: `<div style="width: 100%; height: 100%;">
            <div data-dojo-attach-point="mainLayoutContainer"
                 data-dojo-type="epi/shell/layout/PreserveRatioBorderContainer"
                 data-dojo-props="gutters: false, livesplitters: true" style="width: 100%; height: 100%">
                <div data-dojo-attach-point="toolbar" data-dojo-type="epi-cms/contentediting/EditToolbar"
                     data-dojo-props="region:'top'"></div>
                <div data-dojo-attach-point="notificationBar" data-dojo-type="epi-cms/contentediting/NotificationBar"
                     data-dojo-props="region:'top', layoutPriority: 99"></div>
                <div data-dojo-attach-point="editLayoutContainer" data-dojo-type="dijit/layout/ContentPane"
                     data-dojo-props="region: 'left', layoutPriority: 95, splitter: true, minSize: 400"
                     style="width: 50%; min-width: 400px">
                </div>
                <div>
                    <div data-dojo-attach-point="iframeWidget" data-dojo-type="epi/shell/widget/IframeWithOverlay"
                         data-dojo-props="region: 'center', layoutPriority: 100"></div>
                </div>
                <div style="display: none">
                    <div data-dojo-attach-point="iframeWithOverlay" data-dojo-type="epi/shell/widget/IframeWithOverlay"
                         data-dojo-props="region: 'center', layoutPriority: 100, iframeName:'\${iframeName}'"></div>
                </div>
            </div>
        </div>`,

        postMixInProperties: function () {
            this.inherited(arguments);

            topic.publish("/epi/shell/context/refreshcurrent");

            topic.subscribe("resize-sidebyside", function () {
                setTimeout(function () {
                    this.resize();
                }.bind(this), 0);
            }.bind(this));
        },

        _onViewRenderPostedProperties: function () {
            // it has to be commented out because it is causing the page to reload twice, caused by a9480e766dd601be83b251d1fbff4b24fabef7fa
            // return this._ensurePreviewReady(null, true, true, this._currentViewModel.viewName, true);
        },

        _ensurePreviewReady: function (action, reload, forceReload, viewName) {
            if (viewName !== "sidebysideedit") {
                return;
            }

            var def = new Deferred();

            if (action) {
                def = action;
            } else {
                def.resolve();
            }

            // notify view is changing
            this._onViewChangeRequest();

            // Only reload the iframe when not in all properties mode. This is to optimize the load
            // times for all properties mode.
            if (reload) {
                def = def.then(function (actionPromiseResult) {
                    return when(this._getPreviewUrl(viewName), function (url) {
                        if (this._currentViewModel) {
                            when(this._stickyViewSelector.get(this._currentViewModel.contentData.hasTemplate, this._currentViewModel.contentData.typeIdentifier)).then(function (value) {
                                if (value === "sidebysideedit") {
                                    if (!this.connected) {
                                        this.connect(this.iframeWidget.iframe, "onLoad", function () {
                                            var initialData = this._getInitialData(url);
                                            var window = this.iframeWidget.iframe.getWindow();
                                            this._postMessage.publish("epiReady", initialData, window);
                                            this._onViewChangeCompleted();
                                        }.bind(this));
                                        this.connected = true;
                                    }

                                    // this is needed because otherwise the iframe is cut and need to be manually resized...
                                    this.iframeWidget.iframe.autoFit = true;
                                    // this.iframeWidget.iframe.domNode.src = url;
                                    this.iframeWidget.iframe.load(url);
                                }
                            }.bind(this));

                            return actionPromiseResult;
                        }
                    }.bind(this));
                }.bind(this));
            }

            this._ensurePreviewReadyPromise = when(def,
                function (actionPromiseResult) {
                    var doc = this.iframeWithOverlay.iframe.getDocument();
                    var props = this.iframeWithOverlay.iframe.siteProperties;
                    // wait for the setup of the overlay to become ready(update the overlay items needed) which will happen async in onPreviewReady
                    var handle = this.connect(this._currentViewComponent, "onPrepareOverlayComplete", function () {
                        this.disconnect(handle);
                        handle = null;

                        this.iframeWithOverlay.overlay.set("enabled", this._currentViewModel.get("showOverlay"));

                        // TODO: Enable the overlay again when we implement the user story #116539 - Projects - Editing while in Preview
                        // If the Projects preview is enabled disable the editing overlay
                        if (this._viewSettingsManager.get("enabled") && this._viewSettingsManager.getSettingProperty("project")) {
                            this.iframeWithOverlay.overlay.set("enabled", false);
                        }
                        this.iframeWithOverlay.layout(true);

                        // notify view is changed
                        this._onViewChangeCompleted();
                    });

                    // Make sure we're visible
                    domStyle.set(this.domNode, "visibility", "visible");

                    this._viewSettingsManager.onPreviewReady(this.iframeWithOverlay);
                    this._currentViewComponent.onPreviewReady(this._currentViewModel, doc, !!actionPromiseResult, props);

                    this._editNotifications.updateSettings({ viewModel: this._currentViewModel, viewSetting: this._viewSettingsManager });
                }.bind(this)
            );
            return this._ensurePreviewReadyPromise;
        },
    });
});
