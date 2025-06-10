define([
    "dojo/_base/declare",
    "epi/_Module",
    "epi-cms/command/_NonEditViewCommandMixin"
], function (
    declare,
    _Module,
    _NonEditViewCommandMixin
) {
    return declare([_Module], {
        initialize: function () {
            this.inherited(arguments);

            var originalViewChanged = _NonEditViewCommandMixin.prototype._viewChanged;
            _NonEditViewCommandMixin.prototype._viewChanged = function (type) {
                originalViewChanged.apply(this, arguments);

                this.set("isAvailable",
                    type === "epi-cms/contentediting/PageDataController" ||
                    type === "side-by-side-editing/SideBySideController" ||
                    type === "epi-cms/compare/views/CompareView");
            }
        }
    });
});
