/// <version>2013.04.14</version>
/// <summary>Works with the Kendo UI 2013 Q1 and jQuery 1.9.1</summary>

(function (kendo, $) {
    kendo.arrays = {
        /// <signature>
        ///   <summary>
        ///   Extend the kendo namespace with additional functions.
        ///   </summary>
        /// </signature>

        find: function (array, criteria) {
            /// <signature>
            ///   <summary>Find a JSON Object in an array.</summary>
            ///   <param name="array" type="Array">Array of JSON objects.</param>
            ///   <param name="criteria" type="Object">
            ///     Criteria to find the JSON Object.
            ///     - attr: the name of the JSON attribute to search on.
            ///     - value: the value of to find.
            ///   </param>
            ///   <returns type="JSON Object or null if not found" />
            /// </signature>

            var result = null;
            $.each(array, function (idx, item) {
                if (item[criteria.attr] != undefined) {
                    if (item[criteria.attr].toString() == criteria.value) {
                        result = item;
                        return false;
                    }
                }
            });
            return result;
        },

        findAll: function (array, criteria) {
            /// <signature>
            ///   <summary>Find a JSON Object in an array.</summary>
            ///   <param name="array" type="Array">Array of JSON objects.</param>
            ///   <param name="criteria" type="Object">
            ///     Criteria to find the JSON Objects.
            ///     - attr: the name of the JSON attribute to search on.
            ///     - value: the value of to find.
            ///   </param>
            ///   <returns type="JSON Objects or null if not found" />
            /// </signature>

            var results = [];
            $.each(array, function (idx, item) {
                if (item[criteria.attr] != undefined) {
                    if (item[criteria.attr].toString() == criteria.value) {
                        results.push(item);
                    }
                }
            });
            return results.length == 0 ? null : results;
        }
    };


    /*
     *
     * ExtBorderLayout
     *
     */

    var ExtLayoutTitleBar = function (splitter, pane, options) {
        /// <signature>
        ///   <summary>
        ///   Create a "titlebar" to be used specifically with a pane within the ExtLayoutSplitter.
        ///   </summary>
        /// </signature>

        this._splitter = splitter;
        this._pane = pane;
        this._options = options;
        this._options.title = this._options.title || "";
        this._options.expandedSize = options.size;
        this._template = kendo.template('<div class="k-window-titlebar k-header k-ext-layout-header"><span class="k-window-title k-ext-layout-title">#= title #</span> #if (arrowsCss.length > 0) { # <div class="k-window-actions"><a href="\\#" class="k-window-action k-link k-ext-toggle k-ext-expanded"><span class="k-icon #= arrowsCss #">Collapse</span></a></div></div> # } #');
        this._callback = null;
        this.element = null;

        this._vertTitle = "";
        this.vertTitleName();
    };
    ExtLayoutTitleBar.prototype = {
        init: function () {
            /// <signature>
            ///   <summary>
            ///   Initialize and display a title for a splitter pane.
            ///   </summary>
            /// </signature>

            var that = this;
            var $pane = $(that._pane);

            // Based on the region, determine the initial image to display for
            // the toggle button.
            that._options.arrowsCss = that._options.collapsible
                ? that._options.region == "north"
                    ? "k-ext-arrows-up"
                    : that._options.region == "south"
                        ? "k-ext-arrows-down"
                        : that._options.region == "east"
                            ? "k-ext-arrows-right"
                            : "k-ext-arrows-left"
                : "";
            if (that._options.collapsed) {
                that._options.arrowsCss = that._options.arrowsCss == "k-ext-arrows-up"
                    ? "k-ext-arrows-down"
                    : that._options.arrowsCss == "k-ext-arrows-down"
                        ? "k-ext-arrows-up"
                        : that._options.arrowsCss == "k-ext-arrows-right"
                            ? "k-ext-arrows-left"
                            : that._options.arrowsCss == "k-ext-arrows-left"
                                ? "k-ext-arrows-right"
                                : "";
            }

            // Add the title bar to the pane.
            $pane.prepend(that._template(that._options));

            that.element = $pane.children("div.k-window-titlebar");

            // When the user clicks on the "toggle" button, expand / collapse
            // the pane.
            that.element.find(".k-ext-toggle").on("click", function () {
                var $toggle = $(this);
                var action = $toggle.hasClass("k-ext-expanded")
                    ? "collapse"
                    : "expand";
                that._splitter.toggle(that._pane, action == "expand");

                that.toggle(action, $toggle);
            });
        },

        toggle: function (action, $toggle) {
            /// <signature>
            ///   <summary>
            ///   Change the display of the titlebar.
            ///   </summary>
            /// </signature>

            var that = this;
            var $pane = $(that._pane);

            if (!$toggle) {
                $toggle = that.element.find(".k-ext-toggle");
            }

            that._options.collapsed = action == "collapse";

            that.update();

            var $icon = $toggle.children(".k-icon");

            if (that._splitter.orientation == "horizontal") {
                if ($icon.hasClass("k-ext-arrows-left")) {
                    $icon.removeClass("k-ext-arrows-left").addClass("k-ext-arrows-right");
                } else {
                    $icon.removeClass("k-ext-arrows-right").addClass("k-ext-arrows-left");
                }
            } else {
                if ($icon.hasClass("k-ext-arrows-up")) {
                    $icon.removeClass("k-ext-arrows-up").addClass("k-ext-arrows-down");
                } else {
                    $icon.removeClass("k-ext-arrows-down").addClass("k-ext-arrows-up");
                }
            }
        },

        vertTitleName: function (title) {
            title = title || this._options.title;

            for (var idx = 0; idx < this._options.title.length; idx++) {
                this._vertTitle += this._options.title[idx] + "<br/>";
            }
        },

        update: function () {
            var that = this;

            var $pane = $(that._pane);
            var $titlebar = that.element;
            var $toggle = $titlebar.find(".k-ext-toggle");

            var $splitbar;
            var $otherPane;
            var position;

            if ($pane.next().hasClass("k-splitbar")) {
                $splitbar = $pane.next();
                $otherPane = $splitbar.next();
            } else {
                $splitbar = $pane.prev();
                $otherPane = $splitbar.prev();
            }

            if (that._options.collapsed) {
                // Resize the pane so that it is 25px wide/high.
                if (that._splitter.orientation == "horizontal") {
                    if ($pane.width() < 32) {
                        $pane.css("width", "32px");
                        if (that._options.region == "west") {
                            $splitbar.css("left", "32px");
                            $otherPane.css("left", "39px").width($otherPane.width() - 39);
                        } else {
                            $pane.css("left", parseInt($pane.css("left")) - 34);
                            $splitbar.css("left", parseInt($splitbar.css("left")) - 34);
                            $otherPane.css("right", "39px").width($otherPane.width() - 39);
                        }
                        // Hide the horizontal title.
                        $titlebar.children("span.k-ext-layout-title").css("display", "none");

                        // Resize the titlebar to extend the entire height of the pane.
                        $titlebar.css("height", $splitbar.height());

                        // If the vertical title is not displayed, then display it.
                        if ($titlebar.find("div.k-ext-vertical-layout-title").length == 0) {
                            $titlebar.append(kendo.format("<div style='position: absolute; top: 40px;' class='k-window-title k-ext-layout-title k-ext-vertical-layout-title'>{0}</div>", that._vertTitle));
                        }
                    }
                } else {
                    if ($pane.height() < 32) {
                        $pane.css("height", "32px");
                        if (that._options.region == "north") {
                            $splitbar.css("top", "32px");
                            $otherPane.css("top", "39px").height($otherPane.height() - 32);
                        } else {
                            $pane.css("top", parseInt($pane.css("top")) - 34);
                            $splitbar.css("top", parseInt($splitbar.css("top")) - 34);
                            $otherPane.css("bottom", "39px").height($otherPane.height() - 32);
                        }
                    }
                }
                $toggle.removeClass("k-ext-expanded").addClass("k-ext-collapsed");
            } else {
                // Show the horizontal titlebar, and if this is a horizontal splitter, then
                // hide the verticle title.
                $titlebar.height(18);
                $toggle.removeClass("k-ext-collapsed").addClass("k-ext-expanded");
                $toggle.closest(".k-window-titlebar").children(".k-window-title").css("display", "");
                $titlebar.find(".k-ext-vertical-layout-title").remove();
            }
        }
    };

    var ExtLayoutSplitter = kendo.ui.Splitter.extend({
        /// <signature>
        ///   <summary>
        ///   Create a splitter to be used specifically with the ExtBorderLayout.
        ///   </summary>
        /// </signature>

        _height: null,

        init: function (element, options) {
            /// <signature>
            ///   <summary>
            ///   Initialize the splitter.
            ///   </summary>
            /// </signature>

            var that = this;

            kendo.ui.Splitter.fn.init.call(that, element, options);

            that.element.data("kendoSplitter", that);
            $.each(that._panes(), function (idx, pane) {
                var paneOptions = $(pane).data("pane");

                if (paneOptions.collapsible || paneOptions.showTitlebar) {
                    var extLayoutTitleBar = new ExtLayoutTitleBar(that, pane, paneOptions);
                    extLayoutTitleBar.init();
                    $(pane).data("titlebar", extLayoutTitleBar);
                }
            });

            // setTimeout(function () { that.resize(); }, 100);

            setInterval(function () { that.updateCollapsedPanes(); }, 50);
        },

        _triggerAction: function () {
            /// <signature>
            ///   <summary>
            ///   Override the default behavior when the user clicks on the expand / collapse
            ///   icon in the splitterbar and call the ExtLayoutTitle.toggle function.
            ///   </summary>
            /// </signature>

            this.toggle(arguments[1], arguments[0] == "expand");
            arguments[1].data("titlebar").toggle(arguments[0]);
        },

        updateCollapsedPanes: function (e) {
            /// <signature>
            ///   <summary>
            ///   Loop through all the panes.  If the pane has a titlebar and is collapsed, then resize 
            //    the pane to 25px to display the titlebar.
            ///   </summary>
            /// </signature>

            var that = this;

            var panes = that._panes();

            $.each(panes, function (idx, pane) {
                var title = $(pane).data("titlebar");
                if (title && (e == undefined || title.element[0] != e.target)) {
                    if (title._options.collapsed) {
                        title.update();
                    }
                }
            });
        },

        resize: function () {
            /// <signature>
            ///   <summary>
            ///   Resize the splitter to fit within the parent.
            ///   </summary>
            /// </signature>

            var that = this;
            var $parent = that.element.parent();
            var height = $parent.height();

            if (that._height != height) {
                that._height = height;

                // Get any margins or padding applied to the body and the border for the splitter.
                var mt = parseInt($parent.css("margin-top"));
                var mb = parseInt($parent.css("margin-bottom"))
                var pt = parseInt($parent.css("padding-top"))
                var pb = parseInt($parent.css("padding-bottom"))
                var btw = parseInt(that.element.css("border-top-width"))
                var bbw = parseInt(that.element.css("border-bottom-width"));
                var offset = (isNaN(mt) ? 0 : mt) + (isNaN(mb) ? 0 : mb) + (isNaN(pt) ? 0 : pt) +
                    (isNaN(pb) ? 0 : pb) + (isNaN(btw) ? 0 : btw) + (isNaN(bbw) ? 0 : bbw);
                that.element.height(that._height - offset).resize();

                if (that.options.orientation == "vertical") {
                    var panes = that.element.children("div.k-pane, div.k-splitbar");
                    $.each(panes, function (idx, pane) {
                        $(pane).css("width", "100%");
                    });
                }
            }
        },

        options: {
            name: "ExtLayoutSplitter"
        }
    });
    kendo.ui.plugin(ExtLayoutSplitter);

    var ExtBorderLayout = kendo.ui.Widget.extend({
        /// <signature>
        ///   <summary>
        ///   Create a border layout.
        ///   </summary>
        /// </signature>

        _outerSplitter: null,
        _innerSplitter: null,

        init: function (element, options) {
            /// <signature>
            ///   <summary>
            ///   Initialize the border layout using splitters.
            ///   </summary>
            /// </signature>

            var that = this;

            kendo.ui.Widget.fn.init.call(that, element, options);

            var horizontalPanes = [];
            var verticalPanes = [];

            // No regions, no layout.
            if (!options.items) {
                throw "The items array must be defined";
            }

            // Get the regions passed in.
            var north = kendo.arrays.find(options.items, { attr: "region", value: "north" });
            var south = kendo.arrays.find(options.items, { attr: "region", value: "south" });
            var east = kendo.arrays.find(options.items, { attr: "region", value: "east" });
            var west = kendo.arrays.find(options.items, { attr: "region", value: "west" });
            var center = kendo.arrays.find(options.items, { attr: "region", value: "center" });

            /* Validate the regions. */

            if (center == null) {
                throw "A center item must be defined";
            }

            if (north == null && south == null && east == null && west == null) {
                throw "A region of north, south, east or west must be defined";
            }

            var $layout = $(element);

            /* Move the regions into the correct position and add them to the appropriate arrays. */

            // If there are north or south regions defined, then add them to the vertical array.
            if (north != null || south != null) {
                if (north != null) verticalPanes.push(north);

                // If east and west are not defined then add the center region to the vertical array.
                if (east == null && west == null) {
                    verticalPanes.push(center);
                    // If east and west are not defined, then create a center region for the "inner" splitter.
                } else {
                    var innerSplitterId = kendo.format("{0}_innerSplitterContents", element.id);
                    $layout.append($(kendo.format("<div id='{0}'/>", innerSplitterId)).attr("class", "k-ext-inner-splitter-contents"));
                    verticalPanes.push({
                        content: kendo.format("#{0}", innerSplitterId)
                    });
                }

                if (south != null) verticalPanes.push(south);
            }

            // If there are east or west regions defined, then add them to the horizontal array and add the center
            // region to the horizontal array.
            if (west != null) horizontalPanes.push(west);
            if (east != null || west != null) horizontalPanes.push(center);
            if (east != null) horizontalPanes.push(east);

            // Create a div for the outer splitter.
            var $outerDiv = $(kendo.format("<div id='{0}_outerSplitter'/>", element.id));
            $layout.append($outerDiv);

            // If there are east or west regions...
            if (verticalPanes.length > 0) {
                // Add the north and south regions to the outer splitter.
                $.each(verticalPanes, function (idx, pane) {
                    $outerDiv.append($(pane.content));
                });
                // Get the div that was created for the innter splitter and add the
                // east, center and west regions.
                var $innerDiv = $(kendo.format("#{0}_innerSplitterContents", element.id));
                $.each(horizontalPanes, function (idx, pane) {
                    $innerDiv.append($(pane.content));
                });

                // Initialize the outer splitter.
                that._outerSplitter = $outerDiv.kendoExtLayoutSplitter({ orientation: "vertical", panes: verticalPanes }).data("kendoExtLayoutSplitter");

                // Initialize the inner splitter.
                that._innerSplitter = $innerDiv.kendoExtLayoutSplitter({ panes: horizontalPanes }).data("kendoExtLayoutSplitter");
                // There are no east and west regions.
            } else {
                // Add the north, center and south regions to the outer splitter.
                $.each(horizontalPanes, function (idx, pane) {
                    $outerDiv.append($(pane.content));
                });

                // Initialize the outer splitter.
                that._outerSplitter = $outerDiv.kendoExtLayoutSplitter({ panes: horizontalPanes }).data("kendoExtLayoutSplitter");
            }

            if (that._outerSplitter != null) {
                setTimeout(function () { that.resize(); }, 100);
            }
        },

        resize: function () {
            /// <signature>
            ///   <summary>
            ///   Resize the border layout to fit within the parent.
            ///   </summary>
            /// </signature>

            var that = this;
            var $parent = that.element.parent();
            var height = parseInt(that.options.height);
            if (isNaN(height)) {
                if ($parent[0] == document.body) {
                    height = $(window).height();
                } else {
                    height = $parent.height();
                }
            }
            // Resize if the height has changed.
            if (that._height != height) {
                that._height = height;

                // Get any margins or padding applied to the body and the border for the splitter.
                var mt = parseInt($parent.css("margin-top"));
                var mb = parseInt($parent.css("margin-bottom"))
                var pt = parseInt($parent.css("padding-top"))
                var pb = parseInt($parent.css("padding-bottom"))
                var btw = parseInt(that.element.css("border-top-width"))
                var bbw = parseInt(that.element.css("border-bottom-width"));
                var offset = (isNaN(mt) ? 0 : mt) + (isNaN(mb) ? 0 : mb) + (isNaN(pt) ? 0 : pt) +
                    (isNaN(pb) ? 0 : pb) + (isNaN(btw) ? 0 : btw) + (isNaN(bbw) ? 0 : bbw);
                that.element.height(that._height - offset).resize();

                // Resize the layout splitters.
                that._outerSplitter.resize();
                if (that._innerSplitter != null) {
                    that._innerSplitter.resize();
                }
            }

            if (that.options.height == "fill") {
                setTimeout(function () { that.resize(); }, 100);
            }
        },

        setTitle: function (region, title) {
            var paneOptions = kendo.arrays.find(this.options.items, { attr: "region", value: region });

            if (paneOptions != null) {
                var $pane = $(paneOptions.content);
                var titlebar = $pane.data("titlebar");
                titlebar.vertTitleName(title);
                $pane.find(".k-ext-layout-title").text(title);
            }
        },

        options: {
            name: "ExtBorderLayout",
            height: "fill"
        }
    });
    kendo.ui.plugin(ExtBorderLayout);


    /*
     *
     * ExtDialog
     *
     */

    var ExtDialog = kendo.ui.Window.extend({
        _buttonTemplate: kendo.template('<div class="k-ext-dialog-buttons" style="position:absolute; bottom:10px; text-align:center; width:#= parseInt(width) - 14 #px;"><div style="display:inline-block"># $.each (buttons, function (idx, button) { # <button class="k-button" style="margin-right:5px; width:100px;">#= button.name #</button> # }) # </div></div>'),
        _contentTemplate: kendo.template('<div class="k-ext-dialog-content" style="height:#= parseInt(height) - 55 #px;; width:#= parseInt(width) - 14 #px;overflow:auto;">'),

        init: function (element, options) {
            /// <signature>
            ///   <summary>
            ///   Initialize the dialog.
            ///   </summary>
            /// </signature>

            var that = this;

            options.visible = options.visible || false;

            kendo.ui.Window.fn.init.call(that, element, options);
            $(element).data("kendoWindow", that);

            var html = $(element).html();
            $(element).html(that._contentTemplate(options));
            $(element).find("div.k-ext-dialog-content").append(html);

            $(element).after(that._buttonTemplate(options));

            $.each(options.buttons, function (idx, button) {
                if (button.click) {
                    $($(element).parent().find(".k-ext-dialog-buttons .k-button")[idx]).on("click", { handler: button.click }, function (e) {
                        e.data.handler({ button: this, dialog: that });
                    });
                }
            });

            that.bind("resize", function (e) {
                that.resizeDialog();
            });
        },

        resizeDialog: function () {
            var that = this;
            var $dialog = $(that.element);
            var width = $dialog.width();
            var height = $dialog.height();
            $dialog.parent().find(".k-ext-dialog-buttons").width(width);
            $dialog.parent().find(".k-ext-dialog-content").width(width).height(height - 39);
        },

        options: {
            name: "ExtDialog"
        }
    });
    kendo.ui.plugin(ExtDialog);



    /*
     *
     * AlertDialog
     *
     */

    kendo.ui.ExtAlertDialog = {
        show: function (options) {
            return new $.Deferred(function (deferred) {
                var dialog = null;

                if ($("#extAlertDialog").length > 0) {
                    $("#extAlertDialog").parent().remove();
                }

                options = $.extend({
                    width: "300px",
                    height: "100px",
                    buttons: [{
                        name: "OK",
                        click: function (e) {
                            dialog.close();
                            deferred.resolve({ button: "OK" });
                        }
                    }],
                    modal: true,
                    visible: false,
                    message: "",
                    icon: "k-ext-information"
                }, options);

                $(document.body).append(kendo.format("<div id='extAlertDialog' style='position:relative;'><div style='position:absolute;left:10px;top:10px;' class='{0}'></div><div style='display:inline-block;margin-left:45px;'>{1}</div></div>", options.icon, options.message));
                dialog = $("#extAlertDialog").kendoExtDialog(options).data("kendoExtDialog");
                $("#extAlertDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
                dialog.center().open();
            });
        },

        hide: function () {
            $("#extAlertDialog").data("kendoExtDialog").close();
        }
    };



    /*
     *
     * OkCancelDialog
     *
     */

    kendo.ui.ExtOkCancelDialog = {
        show: function (options) {
            return new $.Deferred(function (deferred) {
                if ($("#extOkCancelDialog").length > 0) {
                    $("#extOkCancelDialog").parent().remove();
                }

                options = $.extend({
                    width: "300px",
                    height: "100px",
                    buttons: [{
                        name: "OK",
                        click: function (e) {
                            $("#extOkCancelDialog").data("kendoExtDialog").close();
                            deferred.resolve({ button: "OK" });
                        }
                    }, {
                        name: "Cancel",
                        click: function (e) {
                            $("#extOkCancelDialog").data("kendoExtDialog").close();
                            deferred.resolve({ button: "Cancel" });
                        }
                    }],
                    modal: true,
                    visible: false,
                    message: "",
                    icon: "k-ext-information"
                }, options);

                $(document.body).append(kendo.format("<div id='extOkCancelDialog' style='position:relative;'><div style='position:absolute;left:10px;top:10px;' class='{0}'></div><div style='display:inline-block;margin-left:45px;'>{1}</div></div>", options.icon, options.message));
                $("#extOkCancelDialog").kendoExtDialog(options);
                $("#extOkCancelDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
                $("#extOkCancelDialog").data("kendoExtDialog").center().open();
            });
        }
    };



    /*
     *
     * YesNoDialog
     *
     */

    kendo.ui.ExtYesNoDialog = {
        show: function (options) {
            return new $.Deferred(function (deferred) {
                if ($("#extYesNoDialog").length > 0) {
                    $("#extYesNoDialog").parent().remove();
                }

                options = $.extend({
                    width: "300px",
                    height: "100px",
                    buttons: [{
                        name: "Yes",
                        click: function (e) {
                            $("#extYesNoDialog").data("kendoExtDialog").close();
                            deferred.resolve({ button: "Yes" });
                        }
                    }, {
                        name: "No",
                        click: function (e) {
                            $("#extYesNoDialog").data("kendoExtDialog").close();
                            deferred.resolve({ button: "No" });
                        }
                    }],
                    modal: true,
                    visible: false,
                    message: "",
                    icon: "k-ext-information"
                }, options);

                $(document.body).append(kendo.format("<div id='extYesNoDialog' style='position:relative;'><div style='position:absolute;left:10px;top:10px;' class='{0}'></div><div style='display:inline-block;margin-left:45px;'>{1}</div></div>", options.icon, options.message));
                $("#extYesNoDialog").kendoExtDialog(options);
                $("#extYesNoDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
                $("#extYesNoDialog").data("kendoExtDialog").center().open();
            });
        },

        hide: function () {
            $("#extYesNoDialog").data("kendoExtDialog").close();
        }
    };



    /*
     *
     * InputDialog
     *
     */

    kendo.ui.ExtInputDialog = {
        show: function (options) {
            return new $.Deferred(function (deferred) {
                var dialog = null;

                if ($("#extInputDialog").length > 0) {
                    $("#extInputDialog").parent().remove();
                }

                options = $.extend({
                    width: "300px",
                    height: "100px",
                    buttons: [{
                        name: "OK",
                        click: function (e) {
                            var $inputText = $("#extInputDialog .k-ext-input-dialog-input");
                            if (dialog.options.required && $inputText.val().length == 0) {
                                $inputText.addClass(dialog.options.requiredCss);
                            } else {
                                dialog.close();
                                deferred.resolve({ button: "OK", input: $inputText.val() });
                            }
                        }
                    }, {
                        name: "Cancel",
                        click: function (e) {
                            dialog.close();
                            deferred.resolve({ button: "Cancel" });
                        }
                    }],
                    modal: true,
                    visible: false,
                    message: "",
                    required: false,
                    requiredCss: "k-ext-required"
                }, options);

                $(document.body).append(kendo.format("<div id='extInputDialog' style='position:relative;'><div style='display:block;margin-left:10px;right-margin:10px;'>{0}</div><div style='display:block;margin-left:10px;margin-right:15px;'><input type='text' class='k-ext-input-dialog-input' style='width:100%;'</input></div></div>", options.message));
                dialog = $("#extInputDialog").kendoExtDialog(options).data("kendoExtDialog");
                $("#extInputDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
                dialog.center().open();
            });
        },

        hide: function () {
            $("#extInputDialog").data("kendoExtDialog").close();
        }
    };



    /*
     *
     * WaitDialog
     *
     */

    kendo.ui.ExtWaitDialog = {
        show: function (options) {
            return new $.Deferred(function (deferred) {
                if ($("#extWaitDialog").length > 0) {
                    $("#extWaitDialog").parent().remove();
                }

                options = $.extend({
                    width: "300px",
                    height: "100px",
                    modal: true,
                    visible: false,
                    message: ""
                }, options);

                $(document.body).append(kendo.format("<div id='extWaitDialog' style='position:relative;'><div style='position:absolute;left:10px;top:10px;' class='k-ext-wait'></div><div style='display:inline-block;margin-left:45px;'>{0}</div></div>", options.message));
                $("#extWaitDialog").kendoWindow(options);
                $("#extWaitDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
                $("#extWaitDialog").data("kendoWindow").center().open();

                return deferred.resolve();
            });
        },

        hide: function () {
            $("#extWaitDialog").data("kendoWindow").close();
        }
    };



    /*
     *
     * ExtDropDownGrid
     *
     */

    var ExtDropDownGrid = kendo.ui.Widget.extend({
        _uid: null,
        _grid: null,
        _dropdown: null,

        init: function (element, options) {
            var that = this;

            kendo.ui.Widget.fn.init.call(that, element, options);

            that._uid = new Date().getTime();

            $(element).append(kendo.format("<div id='extGrid{0}' class='k-ext-grid' style='{1};z-index:1;'/>",
                that._uid, options.gridWidth
                    ? kendo.format("width:{0}", options.gridWidth)
                    : ""));
            $(element).append(kendo.format("<input id='extDropDown{0}' class='k-ext-dropdown'/>", that._uid));

            that._grid = $(kendo.format("#extGrid{0}", that._uid)).kendoGrid(options.grid).data("kendoGrid");
            that._grid.bind("change", function (e) {
                setTimeout(function () {
                    var tr = $(that._grid.element).find("tr.k-state-selected");

                    if (tr.length > 0 && tr.hasClass("k-grid-edit-row") === false) {
                        // Get the selected row.
                        var item = that._grid.dataItem(tr);
                        // Display the text for the selected row in the dropdownlist.
                        $dropdownRootElem.find("span.k-input").text(item[that.options.dataTextField]);

                        $(that._grid.element).slideToggle('fast', function () {
                            $(that._grid.element).removeClass("k-custom-visible");
                        });

                        that.trigger("change", e);
                    }
                });
            });

            that._dropdown = $(kendo.format("#extDropDown{0}", that._uid)).kendoDropDownList({
                dataSource: [{ text: "", value: "" }],
                dataTextField: "text",
                dataValueField: "value",
                open: function (e) {
                    //to prevent the dropdown from opening or closing.
                    e.preventDefault();
                    // If the grid is not visible, then make it visible.
                    if (!$(that._grid.element).hasClass("k-custom-visible")) {
                        // Position the grid so that it is below the dropdown.
                        $(that._grid.element).css({
                            "top": $dropdownRootElem.position().top + $dropdownRootElem.height(),
                            "left": $dropdownRootElem.position().left
                        });
                        // Display the grid.
                        $(that._grid.element).slideToggle('fast', function () {
                            that._dropdown.close();
                            $(that._grid.element).addClass("k-custom-visible");
                        });
                    }
                }
            }).data("kendoDropDownList");

            if (options.dropDownWidth) {
                that._dropdown._focused.width(options.dropDownWidth);
            }

            var $dropdownRootElem = $(that._dropdown.element).closest("span.k-dropdown");

            $(that._grid.element).hide().css({
                "border": "1px solid grey",
                "position": "absolute"
            });

            $(document).click(function (e) {
                // Ignore clicks on the grid.
                if ($(e.target).closest(kendo.format("#extGrid{0}", that._uid)).length == 0 &&
                    ($(e.target).closest("form.k-filter-menu").length == 0) &&  /* Filter form */
                    ($(e.target).hasClass("k-link") && $(e.target).data("page") > 0) == false /* Pager */) {
                    // If visible, then close the grid.
                    if ($(that._grid.element).hasClass("k-custom-visible")) {
                        $(that._grid.element).slideToggle('fast', function () {
                            $(that._grid.element).removeClass("k-custom-visible");
                        });
                    }
                }
            });
        },

        dropDownList: function () {
            return this._dropdown;
        },

        grid: function () {
            return this._grid;
        },

        options: {
            name: "ExtDropDownGrid"
        }
    });
    kendo.ui.plugin(ExtDropDownGrid);



    /*
     *
     * ExtDropDownTreeView
     *
     */

    var ExtDropDownTreeView = kendo.ui.Widget.extend({
        _uid: null,
        _treeview: null,
        _dropdown: null,

        init: function (element, options) {
            var that = this;

            kendo.ui.Widget.fn.init.call(that, element, options);

            that._uid = new Date().getTime();

            $(element).append(kendo.format("<input id='extDropDown{0}' class='k-ext-dropdown'/>", that._uid));
            $(element).append(kendo.format("<div id='extTreeView{0}' class='k-ext-treeview' style='z-index:1;'/>", that._uid));

            // Create the dropdown.
            that._dropdown = $(kendo.format("#extDropDown{0}", that._uid)).kendoDropDownList({
                dataSource: [{ text: "", value: "" }],
                dataTextField: "text",
                dataValueField: "value",
                open: function (e) {
                    //to prevent the dropdown from opening or closing. A bug was found when clicking on the dropdown to 
                    //"close" it. The default dropdown was visible after the treeview had closed.
                    e.preventDefault();
                    // If the treeview is not visible, then make it visible.
                    if (!$treeviewRootElem.hasClass("k-custom-visible")) {
                        // Position the treeview so that it is below the dropdown.
                        $treeviewRootElem.css({
                            "top": $dropdownRootElem.position().top + $dropdownRootElem.height(),
                            "left": $dropdownRootElem.position().left
                        });
                        // Display the treeview.
                        $treeviewRootElem.slideToggle('fast', function () {
                            that._dropdown.close();
                            $treeviewRootElem.addClass("k-custom-visible");
                        });
                    }
                }
            }).data("kendoDropDownList");

            if (options.dropDownWidth) {
                that._dropdown._inputWrapper.width(options.dropDownWidth);
            }

            var $dropdownRootElem = $(that._dropdown.element).closest("span.k-dropdown");

            // Create the treeview.
            that._treeview = $(kendo.format("#extTreeView{0}", that._uid)).kendoTreeView(options.treeview).data("kendoTreeView");
            that._treeview.bind("select", function (e) {
                // When a node is selected, display the text for the node in the dropdown and hide the treeview.
                $dropdownRootElem.find("span.k-input").text($(e.node).children("div").text());
                $treeviewRootElem.slideToggle('fast', function () {
                    $treeviewRootElem.removeClass("k-custom-visible");
                    that.trigger("select", e);
                });
            });

            var $treeviewRootElem = $(that._treeview.element).closest("div.k-treeview");

            // Hide the treeview.
            $treeviewRootElem
                .width($dropdownRootElem.width())
                .css({
                    "border": "1px solid grey",
                    "display": "none",
                    "position": "absolute",
                    "background-color": that._dropdown.list.css("background-color")
                });

            $(document).click(function (e) {
                // Ignore clicks on the treetriew.
                if ($(e.target).closest("div.k-treeview").length == 0) {
                    // If visible, then close the treeview.
                    if ($treeviewRootElem.hasClass("k-custom-visible")) {
                        $treeviewRootElem.slideToggle('fast', function () {
                            $treeviewRootElem.removeClass("k-custom-visible");
                        });
                    }
                }
            });
        },

        dropDownList: function () {
            return this._dropdown;
        },

        treeview: function () {
            return this._treeview;
        },

        options: {
            name: "ExtDropDownTreeView"
        }
    });
    kendo.ui.plugin(ExtDropDownTreeView);



    /*
     *
     * ExtEditor
     *
     */

    var ExtEditor = kendo.ui.Editor.extend({
        init: function (element, options) {
            var that = this;

            kendo.ui.Editor.fn.init.call(that, element, options);
            $(element).data("kendoEditor", that);
        },

        options: {
            name: "ExtEditor"
        }
    });
    kendo.ui.plugin(ExtEditor);



    /*
     *
     * ExtTextBox
     *
     */

    var ExtTextBox = kendo.ui.Widget.extend({
        init: function (element, options) {
            var that = this;
            var $input = $(element);

            kendo.ui.Widget.fn.init.call(that, element, options);

            $input.before(kendo.format('<div class="k-input k-textbox k-ext-textbox {0}" {1}></div>',
                that.options.textboxClass,
                that.options.width
                    ? kendo.format("style='width:{0};'", that.options.width)
                    : ""));
            var $div = $input.prev();
            $div.append($input);

            $input.before(kendo.format("<span {0}>{1}</span>",
                that.options.placeholderClass
                    ? kendo.format("class='{0}'", that.options.placeholderClass)
                    : "",
                $input.val().length == 0
                    ? that.options.placeholder
                    : ""));

            $input.on("blur", function () {
                if (that.options.placeholder) {
                    var $input = $(this);

                    if ($input.val().length == 0) {
                        $input.prev("span").text(that.options.placeholder);
                    } else {
                        $input.prev("span").text("");
                    }
                }
            }).on("focus", function () {
                if (that.options.placeholder) {
                    $(this).prev("span").text("");
                }
            });
        },

        options: {
            name: "ExtTextBox"
        }
    });
    kendo.ui.plugin(ExtTextBox);



    /*
     *
     * ExtContextMenu
     *
     */

    var ExtContextMenu = kendo.ui.Menu.extend({
        _itemTemplate: "<li># if (iconCss.length > 0) { #<span class=' #=iconCss # k-icon'></span># } # #= text #</li>",

        init: function (element, options) {
            var that = this;

            $(element).appendTo("body").hide();

            options = $.extend(options,
                {
                    orientation: "vertical"
                });

            // If the list of items has been passed in...
            if (options.items) {
                var itemTemplate = kendo.template(that._itemTemplate);
                $.each(options.items, function (idx, item) {
                    var html = "";
                    if (item.separator) {
                        html = "<li class='k-ext-menu-separator'><hr/><li>";
                    } else {
                        item = $.extend({ iconCss: "" }, item);
                        html = itemTemplate(item);
                    }
                    $(element).append(html);
                });
            }

            // Call the base class init.
            kendo.ui.Menu.fn.init.call(that, element, options);

            // If there are any separators, then remove the k-link class.
            $(that.element).find("li.k-ext-menu-separator span").removeClass("k-link");

            // When the user right-clicks on any of the targets, then display the context menu.
            $(document).on("contextmenu", options.targets, function (e) {
                e.preventDefault();
                that.trigger("beforeopen", e);
                that._currentTarget = e.currentTarget;
                that.show(e.pageX, e.pageY);
                return false;
            });

            if (that.options.beforeOpen) {
                that.bind("beforeopen", that.options.beforeOpen);
            }

            that.bind("select", that._select);

            $(that.element).css({ "width": that.options.width, "position": "absolute" }).addClass("k-block").addClass("k-ext-contextmenu");

            // If the user is not clicking on the context menu, then hide the menu.
            $(document).click(function (e) {
                // Ignore clicks on the contextmenu.
                if ($(e.target).closest(".k-ext-contextmenu").length == 0) {
                    // If visible, then close the contextmenu.
                    if ($(that.element).hasClass("k-custom-visible")) {
                        that.hide();
                    }
                }
            });
        },

        show: function (left, top) {
            var that = this;

            // Position the context menu.
            $(that.element).css({
                "top": top,
                "left": left
            });
            // Display the context menu.
            $(that.element).slideToggle('fast', function () {
                $(that.element).addClass("k-custom-visible");
            });
        },

        hide: function () {
            var that = this;

            $(that.element).slideToggle('fast', function () {
                $(that.element).removeClass("k-custom-visible");
            });
        },

        _select: function (e) {
            if (this.options.itemSelect != undefined) {
                e.target = this._currentTarget;
                this.options.itemSelect.apply(this, [e]);
            }
            this.hide();
        },

        options: {
            name: "ExtContextMenu",
            width: "100px"
        }
    });
    kendo.ui.plugin(ExtContextMenu);
})(window.kendo, window.kendo.jQuery);
