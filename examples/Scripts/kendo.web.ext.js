/// <version>2013.03.11</version>

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

            $(element).parent().append(that._buttonTemplate(options));

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
                    visible: true,
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
                    visible: true,
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
                    visible: true,
                    message: "",
                    icon: "k-ext-information"
                }, options);

                $(document.body).append(kendo.format("<div id='extYesNoDialog' style='position:relative;'><div style='position:absolute;left:10px;top:10px;' class='{0}'></div><div style='display:inline-block;margin-left:45px;'>{1}</div></div>", options.icon, options.message));
                $("#extYesNoDialog").kendoExtDialog(options);
                $("#extYesNoDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
                $("#extYesNoDialog").data("kendoExtDialog").center().open();
            });
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
                    visible: true,
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
                    visible: true,
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

})(window.kendo, window.kendo.jQuery);