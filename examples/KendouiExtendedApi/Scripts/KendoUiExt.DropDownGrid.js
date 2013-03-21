var KendoUiExt = KendoUiExt || {};

KendoUiExt.DropDownGrid = function () {
    var load = function () {
        var dropDownGrid = $("#dropDownGrid").kendoExtDropDownGrid({
            dataTextField: "FirstName",
            dropDownWidth: "100px",
            gridWidth: "700px",
            grid: {
                dataSource: {
                    data: createRandomData(500),    // createRandomData is found in http://demos.kendoui.com/content/shared/js/people.js
                    pageSize: 10,
                    schema: {
                        model: {
                            fields: {
                                FirstName: { type: "string" },
                                LastName: { type: "string" },
                                City: { type: "string" },
                                Title: { type: "string" },
                                BirthDate: { type: "date" },
                                Age: { type: "number" }
                            }
                        }
                    }
                },
                columns: [
                    {
                        field: "FirstName",
                        title: "First Name",
                        width: 100
                    },
                    {
                        field: "LastName",
                        title: "Last Name",
                        width: 100
                    },
                    {
                        field: "City",
                        width: 100
                    },
                    {
                        field: "Title"
                    },
                    {
                        field: "BirthDate",
                        title: "Birth Date",
                        template: '#= kendo.toString(BirthDate,"MM/dd/yyyy") #',
                        width: 100
                    },
                    {
                        field: "Age",
                        width: 50
                    }
                ],
                pageable: true,
                selectable: true,
                filterable: true
            }
        }).data("kendoExtDropDownGrid");

        dropDownGrid.bind("change", function () {
            var selectedRows = this.grid().select();
            var dataItem = this.grid().dataItem(selectedRows[0]);
            $("#userSelection").prepend(kendo.format("<div>You Selected: {0} {1}, {2}</div>", dataItem.FirstName, dataItem.LastName, dataItem.Title));
        });
    };

    var unload = function () {
    };

    return {
        load: load,
        unload: unload
    };
}();