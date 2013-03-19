var KendoUiExt = KendoUiExt || {};

KendoUiExt.YesNoDialog = function () {
    var _dialog = null;

    var load = function () {
        var selectIcon = $("#selectIcon").kendoDropDownList().data("kendoDropDownList");

        var $button = $("#showYesNoDialogButton");

        $button.on('click', function () {
            $.when(kendo.ui.ExtYesNoDialog.show({ title: "Yes/No", message: "This is a sample yes/no box", icon: selectIcon.value() })).done(function (response) {
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