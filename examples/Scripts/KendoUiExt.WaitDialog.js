var KendoUiExt = KendoUiExt || {};

KendoUiExt.WaitDialog = function () {
    var _dialog = null;

    var load = function () {
        var $button = $("#showWaitDialogButton");

        $button.on('click', function () {
            $.when(kendo.ui.ExtWaitDialog.show({ title: "Wait", message: "Waiting for 5 seconds..." })).done(function () {
                setTimeout(function () {
                    kendo.ui.ExtWaitDialog.hide();
                }, 5000);
            });
        });
    };

    var unload = function () {
    };

    return {
        load: load,
        unload: unload
    };
}();