define([
    "dojo/_base/declare",
    "dojo/aspect",
    "dojo/topic",
    "epi-cms/contentediting/FormEditing"
], function (
    declare,
    aspect,
    topic,
    FormEditing
) {

    // We need to check what is the active tab and programatically click it
    // This happens because at some point CMS added so called `sticky tab` which is
    // only preserved in the Forms view, while now we have Side by Side view
    function ensureCorrectTabSelected(form) {
        var item = form.domNode.querySelector("div[data-dojo-attach-point='tablistWrapper']")

        if(item && item.children && item.children[0]) {
            var tablist = item.children[0];
            var checkedIndex = -1;
            if(tablist && tablist.children && tablist.children.length) {
                for (var i = 0; i < tablist.children.length; i++) {
                    if(tablist.children[i].classList.contains("dijitChecked")) {
                        checkedIndex = i;
                        break;
                    }
                }
            }

            if(checkedIndex !== -1) {
                var originalTab = tablist.children[checkedIndex];

                var adjacentIndex;
                if(checkedIndex < tablist.children.length - 1) {
                    adjacentIndex = checkedIndex + 1;
                } else if(checkedIndex > 0) {
                    adjacentIndex = checkedIndex - 1;
                } else {
                    adjacentIndex = -1;
                }

                if(adjacentIndex !== -1) {
                    tablist.children[adjacentIndex].click();
                    originalTab.click();
                }
            }
        }
    }

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

            var formCreateHandle = aspect.after(form, "onFormCreated", () => {
                formCreateHandle.remove();
                formCreateHandle = null;

                if (form.domNode) {
                    ensureCorrectTabSelected(form);
                }
            });
        }
    });
});
