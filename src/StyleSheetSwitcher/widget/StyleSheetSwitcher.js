/*global logger*/
/*
    StyleSheetSwitcher
    ========================

    @file      : StyleSheetSwitcher.js
    @version   : 1.0.0
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
    "StyleSheetSwitcher/widget/StyleSheetSwitcherURL",
    "dojo/_base/lang"],

     function (declare, StyleSheetSwitcherURL, dojoLang) {
    "use strict";

    // Declare widget's prototype.
    return declare("StyleSheetSwitcher.widget.StyleSheetSwitcher", [ StyleSheetSwitcherURL], {
        
        // Override postcreate function..
        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            if (this.mfToExecute !== "") {
               this._executeMF();         
            } else {
                this._updateRendering();
            }
        },

        _executeMF : function(){
            // If a microflow has been set execute the microflow on a click.
            
            
            if (this.mfToExecute !== "") {
                
                
                mx.data.action({
                        params: {
                            actionname: this.mfToExecute,
                            applyto: "none" 
                        },
                        callback: dojoLang.hitch(this, function( resultString ) {
                            this._cssCustom = resultString;
                            this._updateRendering();
                        }),
                        error: dojoLang.hitch(this, function(error) {
                            logger.info(this.id + ": An error occurred while executing microflow: " + error.description);
                        })
                    }, this);
            }
        },
    });
});

require(["StyleSheetSwitcher/widget/StyleSheetSwitcher"]);
