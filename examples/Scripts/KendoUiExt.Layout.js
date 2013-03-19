var KendoUiExt = KendoUiExt || {};

KendoUiExt.Layout = function () {
    var init = function () {
        $("#mainLayout").kendoExtBorderLayout({
            items: [
            {
                title: "Header",
                region: "north",
                content: "#headerPane",
                showTitlebar: false,
                resizable: false,
                size: "50px"
            }, {
                title: "Navigation",
                region: "west",
                content: "#navigationPane",
                collapsible: true,
                size: "275px"
            }, {
                title: "Source Code",
                region: "east",
                content: "#sourceCodePane",
                collapsible: true,
                size: "450px"
            }, {
                region: "center",
                content: "#contentPane"
            }
            ]
        });

        $("#panelbar").kendoPanelBar();
    };

    return {
        init: init
    };
}();