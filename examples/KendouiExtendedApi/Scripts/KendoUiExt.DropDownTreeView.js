var KendoUiExt = KendoUiExt || {};

KendoUiExt.DropDownTreeView = function () {
    var load = function () {
        var dropDownTreeView = $("#dropDownTreeView").kendoExtDropDownTreeView({
            treeview: {
                dataSource: new kendo.data.HierarchicalDataSource({
                    data: [
                        {
                            text: "Furniture", items: [
                              { text: "Tables & Chairs" },
                              { text: "Sofas" },
                              { text: "Occasional Furniture" }
                            ]
                        },
                        {
                            text: "Decor", items: [
                              { text: "Bed Linen" },
                              { text: "Curtains & Blinds" },
                              { text: "Carpets" }
                            ]
                        }
                    ]
                })
            }
        }).data("kendoExtDropDownTreeView");

        // Expand all items.
        dropDownTreeView.treeview().expand(".k-item");

        dropDownTreeView.bind("select", function (e) {
            $("#userSelection").prepend(kendo.format("<div>You Selected: {0}</div>", $(e.node).children("div").text()));
        });
    };

    var unload = function () {
    };

    return {
        load: load,
        unload: unload
    };
}();