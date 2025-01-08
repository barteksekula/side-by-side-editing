define([
    "dojo/_base/declare",
    "dojo/topic",
    "epi-cms/contentediting/PageDataController",
    "dojo/text!./templates/SideBySideController.html"
], function (
    declare,
    topic,
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
        }
    });
});
