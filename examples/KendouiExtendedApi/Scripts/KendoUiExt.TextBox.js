var KendoUiExt = KendoUiExt || {};

KendoUiExt.TextBox = function () {
    var load = function () {
        $("#firstname").kendoExtTextBox({
            width: "200px",
            placeholder: "Enter first name..."
        });

        $("#lastname").kendoExtTextBox({
            textboxClass: "lastname-textbox",
            placeholder: "Enter last name...",
            placeholderClass: "lastname-placeholder"
        });
    };

    var unload = function () {
    };

    return {
        load: load,
        unload: unload
    };
}();