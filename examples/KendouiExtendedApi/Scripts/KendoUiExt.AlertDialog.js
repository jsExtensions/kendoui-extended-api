var KendoUiExt = KendoUiExt || {};

KendoUiExt.AlertDialog = function () {
    var _dialog = null;

    var load = function () {
        var selectIcon = $("#selectIcon").kendoDropDownList().data("kendoDropDownList");

        var $button = $("#showAlertDialogButton");

        $button.on('click', function () {
            $.when(kendo.ui.ExtAlertDialog.show({ title: "Alert!", message: "This is a sample alert box", icon: selectIcon.value() })).done(function () {
                $("#userResponse").append(kendo.format("<div>OK button clicked at: {0}</div>", new Date().toLocaleTimeString()));
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