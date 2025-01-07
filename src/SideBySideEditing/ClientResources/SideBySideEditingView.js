define([
    "dojo/_base/declare",
    "dojo/topic",
    "epi-cms/contentediting/FormEditing"
], function (
    declare,
    topic,
    FormEditing
) {

    return declare([FormEditing], {
        // tags:
        //      internal

        // we set selectFormOnCreating to false to bypass the call to
        // editLayoutContainer.selectChild in _FormEditingMixin since the
        // editLayoutContainer is a dijit/layout/ContentPane that does not have
        // the selectChild method.
        selectFormOnCreation: false,

        placeForm: function (form) {
            this.inherited(arguments);
            form.resize();
            topic.publish("resize-sidebyside");
        }
    });
});
