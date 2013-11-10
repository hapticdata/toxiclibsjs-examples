define(function(require) {
    var each = require('toxi/internals').each,
        TColor = require('toxi/color/TColor');
    /**
     * bi-directional binding of dat/gui -><- TColor
     * any modifications in gui will update the TColor and using any of the
     * "set" functions on TColor will update the gui
     * @param {dat/gui/GUI} gui either the dat.Gui instance or a gui folder
     * @param {Object} object the object of the tcolor property
     * @param {String} key the property key for the TColor to bind
     */
    return function(gui, object, key) {
        var onChange,
            guiController,
            tcolor = object[key],
            o = {};

        o[key] = tcolor.toHexCSS();
        each(TColor.prototype, function(fn, protoKey) {
            //for every "setter" wrap the existing function
            //with in a new one that also updates our gui-color
            if (protoKey.indexOf('set') >= 0 && typeof fn === 'function') {
                tcolor[protoKey] = function() {
                    fn.apply(this, arguments);
                    var hex = this.toHexCSS();
                    //only if it isnt already set, avoid a loop
                    if (o[key] !== hex) {
                        o[key] = hex;
                    }
                };
            }
        });
        //create an onChange function to still receive change-events
        onChange = function(fn) {
            if (typeof fn === 'function') {
                onChange = fn;
            }
        };
        //create the gui element
        guiController = gui.addColor(o,'color')
            .listen()
            .onChange(function() {
            var c = TColor.newHex(o.color.slice(1, o.color.length));
            tcolor.setRGB(c.red(), c.green(), c.blue());
            onChange.apply(this, arguments);
        });
        //attach the onChance to the instance
        guiController.onChange = onChange;
        return guiController;
    };
});
