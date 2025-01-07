define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dojo/when",
    "epi/Url",
    "epi-cms/contentediting/PageDataController",
    "dojo/text!./templates/SideBySideController.html"
], function (
    declare,
    lang,
    topic,
    when,
    Url,
    PageDataController,
    templateString
) {

    return declare([PageDataController], {
        // tags:
        //      internal

        templateString: templateString,

        postMixInProperties: function () {
            this.inherited(arguments);

            topic.publish("/epi/shell/context/refreshcurrent");

            topic.subscribe("resize-sidebyside", function () {
                setTimeout(function () {
                    this.resize();
                }.bind(this), 0);
            }.bind(this));
        },

        _onViewChangeCompleted: function () {
            this.inherited(arguments);

            if (this._currentViewModel && !this.subscribed) {
                this.subscribed = true;
                this.own(this._currentViewModel.watch("isSaved", function (name, wasSaved) {
                    if (wasSaved) {
                        var currentUrl = new Url(this._getPreviewUrl());
                        var randomKey = Math.random().toString(36).slice(4);
                        currentUrl.query.preventCache = randomKey;
                        setTimeout(function () {
                            this.iframeWithOverlay.iframe.domNode.src = currentUrl.toString();
                        }.bind(this), 500);
                    }
                }.bind(this)));
            }
        }
    });
});
