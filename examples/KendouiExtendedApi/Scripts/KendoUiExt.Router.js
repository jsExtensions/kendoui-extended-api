var KendoUiExt = KendoUiExt || {};

KendoUiExt.Router = function () {
    var _router = new kendo.Router();
    var _currentPartial = null;

    var hideAll = function () {
        KendoUiExt.Dialog.hide();

        $("#comingSoon").hide();
        $("#comingSoonCode").hide();
        $("#widgetContent").hide();
        $("#widgetCode").hide();
    };

    _router.route("/", function () {
        hideAll();
    });

    _router.route("/:section", function (section) {
        hideAll();

        if (_currentPartial != null && KendoUiExt[_currentPartial].unload != undefined) {
            KendoUiExt[_currentPartial].unload();
        }

        if (section == "comingSoon") {
            $("#comingSoon").show();
            $("#comingSoonCode").show();
            _currentPartial = null;
        } else {
            _currentPartial = section[0].toUpperCase() + section.substring(1);
            var $content = $("#widgetContent");
            var $code = $("#widgetCode");

            $content.empty();
            $code.empty();

            $content.load(kendo.format("/Partial/{0}.html?_={0}", _currentPartial, new Date().getTime()), function () {
                $content.show();
                KendoUiExt[_currentPartial].load();

                $code.load(kendo.format("/Partial/{0}Code.html", _currentPartial), function () {
                    $code.show();
                    if (navigator.appVersion.indexOf("MSIE 8.0") == -1) {
                        Rainbow.color();
                    }
                });
            });
        }
    });

    var start = function (route) {
        _router.start();
        _router.navigate(route);
    };

    return {
        start: start
    };
}();

$(function () {
    KendoUiExt.Router.start("#/");
    $("#navigationPane .pane-content").load("/Partial/Navigation.html");
});
