var KendoUiExt = KendoUiExt || {};

KendoUiExt.Router = $.sammy("#contentPane", function () {
    var _pages = ["borderLayout", "dialog", "alertDialog", "comingSoon"];
    var _currentPartial = null;

    var hideAll = function () {
        KendoUiExt.Dialog.hide();

        $("#comingSoon").hide();
        $("#comingSoonCode").hide();
        $("#widgetContent").hide();
        $("#widgetCode").hide();
    };

    this.get("#/", function (context) {
        hideAll();
    });

    this.get("#/:section", function (context) {
        var params = this.params;

        hideAll();

        if (_currentPartial != null && KendoUiExt[_currentPartial].unload != undefined) {
            KendoUiExt[_currentPartial].unload();
        }

        if (params.section == "comingSoon") {
            $("#comingSoon").show();
            $("#comingSoonCode").show();
            _currentPartial = null;
        } else {
            _currentPartial = params.section[0].toUpperCase() + params.section.substring(1);
            var $content = $("#widgetContent");
            var $code = $("#widgetCode");

            $content.empty();
            $code.empty();

            $content.load(kendo.format("/Partial/{0}.html?_={0}", _currentPartial, new Date().getTime()), function () {
                $content.show();
                KendoUiExt[_currentPartial].load();

                $code.load(kendo.format("/Partial/{0}Code.html", _currentPartial), function () {
                    $code.show();
                    if (!($.browser.msie && $.browser.version < 9)) {
                        Rainbow.color();
                    }
                });
            });
        }
    });

    $(function () {
        KendoUiExt.Router.run("#/");
        $("#navigationPane .pane-content").load("/Partial/Navigation.html");
    });
})