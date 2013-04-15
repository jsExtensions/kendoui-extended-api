var KendoUiExt = KendoUiExt || {};

KendoUiExt.ContextMenu = function () {
	var load = function () {
		$("#itemcontextmenu").kendoExtContextMenu({
			targets: "#contextMenuTarget, #treeview .k-item .furniture, #treeview .k-item .decor",
			itemSelect: function (e) {
				kendo.ui.ExtAlertDialog.show({
					title: "Selection",
					message: kendo.format('You selected: "{0}" on "{1}"',
						$(e.item).text().trim(),
						$(e.target).text()),
					icon: "k-ext-information"
				});
			}
		});

		$("#categorycontextmenu").kendoExtContextMenu({
			width: "175px",
			targets: "#treeview .k-item .category",
			items: [
				{
					text: "Add Item",
					iconCss: "k-add"
				},
				{
					text: "Rename Category",
					iconCss: "k-edit"
				},
				{
					separator: true
				},
				{
					text: "Delete Category",
					iconCss: "k-delete"
				}
			],
			itemSelect: function (e) {
				kendo.ui.ExtAlertDialog.show({
					title: "Selection",
					message: kendo.format('You selected: "{0}" on "{1}"',
						$(e.item).text().trim(),
						$(e.target).text()),
					icon: "k-ext-information"
				});
			}
		});

		var treeview = $("#treeview").kendoTreeView({
			dataSource: [
                {
                	text: "Furniture",
					type: "category",
                	items: [
						{ text: "Tables & Chairs", type: "furniture" },
						{ text: "Sofas", type: "furniture" },
						{ text: "Occasional Furniture", type: "furniture" }
                    ]
                },
                {
                	text: "Decor",
                	type: "category",
                	items: [
						{ text: "Bed Linen", type: "decor" },
						{ text: "Curtains & Blinds", type: "decor" },
						{ text: "Carpets", type: "decor" }
                    ]
                }
			],
			template: "<span # if (item.type != undefined) { # class='#= item.type #' # } #>#= item.text #</span>"
		}).data("kendoTreeView");

		treeview.expand(".k-item");
	};

	var unload = function () {
	};

	return {
		load: load,
		unload: unload
	};
}();