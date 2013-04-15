var KendoUiExt = KendoUiExt || {};

KendoUiExt.Editor = function () {
    var load = function () {
        var _editorTemplate =
            "<div id='editor-table-dialog'>" +
                "<div class='k-ext-editor-tbl-dlg-row'>" +
                    "<div class='k-ext-editor-tbl-dlg-label'>Rows:</div><div class='k-ext-editor-tbl-dlg-input'><input id='editor-table-dialog-rows'></input></div>" +
                "</div>" +
                "<div class='k-ext-editor-tbl-dlg-row'>" +
                    "<div class='k-ext-editor-tbl-dlg-label'>Columns:</div><div class='k-ext-editor-tbl-dlg-input'><input id='editor-table-dialog-cols'></input></div>" +
                "</div>" +
                "<div>" +
                    "<input id='editor-table-dialog-width' type='checkbox' /><span>100% Width</span>" +
                "</div>" +
            "</div>";

        $("#editor").kendoExtEditor({
            tools: [
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "fontName",
                "fontSize",
                "foreColor",
                "backColor",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "justifyFull",
                "insertUnorderedList",
                "insertOrderedList",
                "indent",
                "outdent",
                "formatBlock",
                "createLink",
                "unlink",
                "insertImage",
                "viewHtml",
                "separator",
                {
                    name: "ext-table",
                    tooltip: "Insert Table",
                    exec: function (e) {
                        var currentNodeIndexes = [];
                        if ($($("#editor").data("kendoExtEditor").body).children().length > 0 && $("#editor").data("kendoExtEditor").currentNode != undefined) {
                            var $currentElement = null;
                            if ($("#editor").data("kendoExtEditor").currentNode.nodeType != 3) {
                                $currentElement = $($("#editor").data("kendoExtEditor").currentNode);
                            } else {
                                $currentElement = $($("#editor").data("kendoExtEditor").currentNode).parent();
                            }
                            if ($currentElement.is("body") == false) {
                                currentNodeIndexes.unshift($currentElement.index());
                                while ($currentElement.parent().is("body") == false) {
                                    $currentElement = $currentElement.parent();
                                    currentNodeIndexes.unshift($currentElement.index());
                                }
                            }
                        }


                        if ($("#editor-table-dialog").length > 0) {
                            // $("#editor-table-dialog").remove();
                            $("#editor-table-dialog").data("kendoExtDialog").center().open();
                        } else {
                            $(document.body).append(_editorTemplate);
                            var $wnd = $("#editor-table-dialog").kendoExtDialog({
                                width: 300,
                                height: 200,
                                modal: true,
                                buttons: [{
                                    name: "OK",
                                    click: function (e) {
                                        var $editor = $("#editor").data("kendoExtEditor");

                                        var rows = $("#editor-table-dialog-rows").data("kendoNumericTextBox").value();
                                        var cols = $("#editor-table-dialog-cols").data("kendoNumericTextBox").value();
                                        var $table = $(kendo.format('<table border="1" cellspacing="0" cellpadding="0" {0}/>', $("#editor-table-dialog-width").is(":checked") ? 'style="width:100%;"' : ''));

                                        for (var row = 0; row < rows; row++) {
                                            var $tr = $("<tr/>");
                                            $table.append($tr);
                                            for (var cell = 0; cell < cols; cell++) {
                                                $tr.append("<td style='min-width:25px;'>&nbsp;</td>");
                                            }
                                        }
                                        $wnd.close();

                                        var $div = $("<div/>");
                                        $div.append($table);
                                        $div.append("<br/>");

                                        var $currentNode = $($("#editor").data("kendoExtEditor").body);
                                        if (currentNodeIndexes.length > 0) {
                                            $.each(currentNodeIndexes, function (idx, index) {
                                                $currentNode = $($currentNode.children()[index]);
                                            });
                                            $currentNode.after($div.html());
                                            $("#editor").data("kendoExtEditor").currentNode = $currentNode.next()[0];
                                        } else {
                                            $currentNode.append($div.html());
                                        }
                                    }
                                },
                                {
                                    name: "Cancel",
                                    click: function (e) {
                                        $wnd.close();
                                    }
                                }]
                            }).data("kendoExtDialog");

                            $("#editor-table-dialog-rows").kendoNumericTextBox({ decimals: 0, value: 2, format: "0" });
                            $("#editor-table-dialog-cols").kendoNumericTextBox({ decimals: 0, value: 2, format: "0" });

                            $wnd.center().open();
                        }
                    }
                }
            ],
            keyup: function (e) {
                $("#editor").data("kendoExtEditor").currentNode = $("#editor").data("kendoExtEditor").getSelection().getRangeAt(0).startContainer;
            },
            select: function (e) {
                $("#editor").data("kendoExtEditor").currentNode = $("#editor").data("kendoExtEditor").getSelection().getRangeAt(0).startContainer;
            }
        }).data("kendoExtEditor");
    };

    return {
        load: load
    };
}();
