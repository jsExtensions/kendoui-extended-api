var KendoUiExt = KendoUiExt || {};

KendoUiExt.InputDialog = function () {
    var _dialog = null;

    var load = function () {
        var $button = $("#showInputDialogButton");

        $button.on('click', function () {
            $.when(kendo.ui.ExtInputDialog.show({ title: "Input", message: "Please enter your name:" })).done(function (response) {
                if (response.button == "OK") {
                    $("#userResponse").append(kendo.format("<div>{0} button clicked at: {1} with input of: {2}</div>", response.button, new Date().toLocaleTimeString(), response.input));
                } else {
                    $("#userResponse").append(kendo.format("<div>{0} button clicked at: {1}</div>", response.button, new Date().toLocaleTimeString()));
                }
            });
        });

        $button.click();
    };

    var unload = function () {
    };

    return {
        load: load,
        unload: unload
    };
}();