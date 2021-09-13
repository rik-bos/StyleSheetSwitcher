/*global logger*/
/*
    StyleSheetSwitcher
    ========================

    @file      : StyleSheetSwitcher.js
    @version   : 1.1.0
    @author    : Rik Bos
    @date      : 2016-08-15
    @copyright : TimeSeries 2016
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    dom,
    dojoDom,
    dojoProp,
    dojoGeometry,
    dojoClass,
    dojoStyle,
    dojoConstruct,
    dojoArray,
    dojoLang,
    dojoText,
    dojoHtml,
    dojoEvent
) {
    "use strict";

    // Declare widget's prototype.
    return declare("StyleSheetSwitcher.widget.StyleSheetSwitcherURL", [_WidgetBase], {
        // Parameters configured in the Modeler.
        mfToExecute: "",
        cssFolder: "",
        cssDefault: "",
        urlEntity: "",
        urlAttribute: "",
        removeDefault: "",
        mxuiBehavior: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,
        _cssCustom: "",
        _urlObj: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            mx.logger.debug(this.id + ".constructor");
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            mx.logger.debug(this.id + ".postCreate");

            if (this.mfToExecute !== "") {
                mx.data.create({
                    entity: this.urlEntity,
                    callback: dojoLang.hitch(this, function (obj) {
                        this._urlObj = obj;
                        this._urlObj.set(this.urlAttribute, mx.appUrl);
                        this._executeMF();
                    }),
                });
            } else {
                this._updateRendering();
            }
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {
            mx.logger.debug(this.id + ".enable");
        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {
            mx.logger.debug(this.id + ".disable");
        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {
            mx.logger.debug(this.id + ".resize");
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            mx.logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // We want to stop events on a mobile device
        _stopBubblingEventOnMobile: function (e) {
            mx.logger.debug(this.id + "._stopBubblingEventOnMobile");
            if (typeof document.ontouchstart !== "undefined") {
                dojoEvent.stop(e);
            }
        },

        _executeMF: function () {
            // If a microflow has been set execute the microflow on a click.
            mx.logger.debug(this.id + "App URL: " + mx.appUrl);

            if (this.mfToExecute !== "") {
                mx.logger.debug(this.id + " - object: " + this._urlObj.getGuid());

                mx.data.action(
                    {
                        params: {
                            actionname: this.mfToExecute,
                            applyto: "selection",
                            guids: [this._urlObj.getGuid()],
                        },
                        callback: dojoLang.hitch(this, function (resultString) {
                            this._cssCustom = resultString;
                            this._updateRendering();
                        }),
                        error: dojoLang.hitch(this, function (error) {
                            mx.logger.info(
                                this.id + ": An error occurred while executing microflow: " + error.description
                            );
                        }),
                    },
                    this
                );
            }
        },

        // Attach events to HTML dom elements
        _setupEvents: function () {
            mx.logger.debug(this.id + "._setupEvents");
        },

        // Rerender the interface.
        _updateRendering: function (callback) {
            mx.logger.debug(this.id + "._updateRendering");

            if (this.cssFolder !== "") {
                if (this.cssFolder.slice(-1) !== "/") {
                    this.cssFolder += "/";
                }
            } else {
                this.cssFolder = "/";
            }

            var cssPath = this.cssFolder;

            if (this._cssCustom !== "" && this._cssCustom !== null) {
                if (this._cssCustom.slice(-4).toLowerCase() === ".css") {
                    cssPath += this._cssCustom;
                }
            } else if (this.cssDefault !== "") {
                if (this.cssDefault.slice(-4).toLowerCase() === ".css") {
                    cssPath += this.cssDefault;
                }
            }

            if (cssPath.slice(-4).toLowerCase() === ".css") {
                if (this.mxuiBehavior === "after") {
                    mx.logger.debug(this.id + " - Removing path: mxclientsystem/mxui/ui/mxui.css");
                    dom.removeCss("mxclientsystem/mxui/ui/mxui.css");
                }

                mx.logger.debug(this.id + " - Adding path: " + cssPath);
                dom.addCss(cssPath);

                if (this.removeDefault === true && this.cssDefault !== this._cssCustom) {
                    if (this.cssDefault.slice(-4).toLowerCase() === ".css") {
                        mx.logger.debug(this.id + " - Removing default: " + this.cssFolder + this.cssDefault);
                        dom.removeCss(this.cssFolder + this.cssDefault);
                    }
                }

                if (this.mxuiBehavior === "after") {
                    mx.logger.debug(this.id + " - Adding path: mxclientsystem/mxui/ui/mxui.css");
                    dom.addCss("mxclientsystem/mxui/ui/mxui.css");
                }
            } else {
                mx.logger.info(this.id + " - Invalid path: " + cssPath);
            }
        },

        // Handle validations.
        _handleValidation: function (validations) {
            mx.logger.debug(this.id + "._handleValidation");
        },

        // Clear validations.
        _clearValidations: function () {
            mx.logger.debug(this.id + "._clearValidations");
        },

        // Show an error message.
        _showError: function (message) {
            mx.logger.debug(this.id + "._showError");
        },

        // Add a validation.
        _addValidation: function (message) {
            mx.logger.debug(this.id + "._addValidation");
        },

        _unsubscribe: function () {
            if (this._handles) {
                dojoArray.forEach(this._handles, function (handle) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }
        },

        // Reset subscriptions.
        _resetSubscriptions: function () {
            mx.logger.debug(this.id + "._resetSubscriptions");
            // Release handles on previous object, if any.
            this._unsubscribe();

            // When a mendix object exists create subscribtions.
            if (this._contextObj) {
                var objectHandle = mx.data.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojoLang.hitch(this, function (guid) {
                        this._updateRendering();
                    }),
                });

                var attrHandle = mx.data.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: this.backgroundColor,
                    callback: dojoLang.hitch(this, function (guid, attr, attrValue) {
                        this._updateRendering();
                    }),
                });

                var validationHandle = mx.data.subscribe({
                    guid: this._contextObj.getGuid(),
                    val: true,
                    callback: dojoLang.hitch(this, this._handleValidation),
                });

                this._handles = [objectHandle, attrHandle, validationHandle];
            }
        },
    });
});

require(["StyleSheetSwitcher/widget/StyleSheetSwitcherURL"]);
