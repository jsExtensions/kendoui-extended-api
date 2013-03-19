var KendoUiExt = KendoUiExt || {};

KendoUiExt.Dialog = function () {
    var _dialog = null;

    var load = function () {
        if (_dialog == null) {
            _dialog = $("#exampleDialog").kendoExtDialog({
                width: "400px",
                height: "250px",
                title: "Dialog Example",
                buttons: [{
                    name: "OK",
                    click: function (e) {
                        alert(kendo.format("You clicked the '{0}' button on the '{1}' dialog.", $(e.button).text(), e.dialog.title()));
                    }
                },
                {
                    name: "Cancel",
                    click: function (e) {
                        alert(kendo.format("You clicked the '{0}' button on the '{1}' dialog.", $(e.button).text(), e.dialog.title()));
                    }
                }]
            }).data("kendoExtDialog");

            $("#showDialogButton").on("click", { dialog: _dialog }, function (e) {
                e.data.dialog.open();
            });
        } else {
            _dialog.open();
        }
    };

    var unload = function () {
        if (_dialog != null) {
            _dialog.wrapper.remove();
            _dialog = null;
        }
    };

    var hide = function () {
        if (_dialog != null) {
            _dialog.close();
        }
    };

    return {
        load: load,
        unload: unload,
        hide: hide
    };
}();