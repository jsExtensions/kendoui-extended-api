var KendoUiExt = KendoUiExt || {};

KendoUiExt.OkCancelDialog = function () {
    var _dialog = null;

    var load = function () {
        var selectIcon = $("#selectIcon").kendoDropDownList().data("kendoDropDownList");

        var $button = $("#showOkCancelDialogButton");

        $button.on('click', function () {
            $.when(kendo.ui.ExtOkCancelDialog.show({ title: "OK/Cancel", message: "This is a sample ok/cancel box", icon: selectIcon.value() })).done(function (response) {
                $("#userResponse").append(kendo.format("<div>{0} button clicked at: {1}</div>", response.button, new Date().toLocaleTimeString()));
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