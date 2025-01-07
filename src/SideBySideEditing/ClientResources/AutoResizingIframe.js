define([
    "dojo/_base/declare",

    // EPi Framework
    "./Iframe",
    "epi/shell/widget/_AutoResizingIframeMixin",
    "epi/shell/widget/_DynamicStyleSheetIframeMixin"
], function (declare, Iframe, _AutoResizingIframeMixin, _DynamicStyleSheetIframeMixin) {

    return declare([Iframe, _AutoResizingIframeMixin, _DynamicStyleSheetIframeMixin], {
        // summary:
        //    This is an auto resizing iframe
        //
        // tags:
        //      internal xproduct
    });
});

