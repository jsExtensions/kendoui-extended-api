var KendoUiExt = KendoUiExt || {};

KendoUiExt.Editor = function () {
    var load = function () {
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
                            $("#editor-table-dialog").remove();
                        }
                        $(document.body).append($("#editorTemplate").html());
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

                                    var $currentNode = $($("#editor").data("kendoExtEditor").body);
                                    if (currentNodeIndexes.length > 0) {
                                        $.each(currentNodeIndexes, function (idx, index) {
                                            $currentNode = $($currentNode.children()[index]);
                                        });
                                        $currentNode.after($table);
                                        $("#editor").data("kendoExtEditor").currentNode = $currentNode.next()[0];
                                    } else {
                                        $currentNode.append($table);
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
            ],
            keyup: function (e) {
                /*
                var currentNodeIndexes = [];
                var currentNode = $("#editor").data("kendoExtEditor").getSelection().getRangeAt(0).startContainer;
                currentNodeIndexes.unshift($(currentNode).index());
                while ($(currentNode).parent().is("body") == false) {
                    currentNodeIndexes.unshift($(currentNode).index());
                }
                $("#editor").data("kendoExtEditor").currentNodeIndexes = currentNodeIndexes;
                */
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