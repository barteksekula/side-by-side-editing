define([], function () {

    return function (settings) {
        console.log("initialize TinyMCE advanced config");
        return Object.assign(settings, {
            myCallback: function () {}
        });
    }
});
