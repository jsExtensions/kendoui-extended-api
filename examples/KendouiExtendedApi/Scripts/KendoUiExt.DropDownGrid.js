var KendoUiExt = KendoUiExt || {};

KendoUiExt.DropDownGrid = function () {
    var _dialog = null;

    var load = function () {
        $("#dropDownGrid").kendoExtDropDownGrid({
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
                selectable: true
            }
        });
    };

    var unload = function () {
    };

    return {
        load: load,
        unload: unload
    };
}();