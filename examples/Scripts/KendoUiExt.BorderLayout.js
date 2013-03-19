var KendoUiExt = KendoUiExt || {};

KendoUiExt.BorderLayout = function () {
    var _borderLayout = null;

    var load = function () {
        if (_borderLayout == null) {
            _borderLayout = $("#exampleBorderLayout").kendoExtBorderLayout({
                items: [
                {
                    title: "North",
                    region: "north",
                    content: "#exampleBorderLayoutNorth",
                    collapsible: true,
                    size: "75px"
                }, {
                    title: "South",
                    region: "south",
                    content: "#exampleBorderLayoutSouth",
                    collapsible: true,
                    size: "75px"
                }, {
                    title: "West",
                    region: "west",
                    content: "#exampleBorderLayoutWest",
                    collapsible: true,
                    size: "150px"
                }, {
                    title: "East",
                    region: "east",
                    content: "#exampleBorderLayoutEast",
                    collapsible: true,
                    size: "100px"
                }, {
                    region: "center",
                    content: "#exampleBorderLayoutCenter"
                }],
                height: "300"
            }).data("kendoExtBorderLayout");
        }
    };

    var unload = function () {
        _borderLayout = null;
    };

    return {
        load: load,
        unload: unload
    };
}();