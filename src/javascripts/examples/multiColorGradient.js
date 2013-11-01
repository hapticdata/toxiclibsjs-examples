define([
    'dat/gui/GUI',
    'extras/gui/addTColor',
    'toxi/internals',
    'toxi/color/ColorGradient',
    'toxi/color/TColor',
    'toxi/util/datatypes/FloatRange',
    'toxi/color/theory/colorTheoryRegistry'
], function( datGui, addTColor, internals, ColorGradient, TColor, FloatRange, colorTheoryRegistry ){

    var each = internals.each,
        buildGui,
        createGradient,
        last;

    last = function( arr ){
        return arr[arr.length-1];
    };

    buildGui = function( options ){
        options = options || {};
        var exports = {},
            gradient = options.gradient || new ColorGradient(),
            gui = options.gui || new datGui(),
            range = options.range || new FloatRange(0.0,255),
            onChange = options.onChange || function(){},
            newColor,
            add;


        exports.toLinearGradientCSS = function(){ console.log( options.toLinearGradientCSS(gradient,range.getAt(1.0)) ); };

        //add a new color-stop on the gradient at the calculated position
        //and return the created gradient-point
        addGradientPoint = function(){
            gradient.addColorAt(Math.floor(Math.random()*255), TColor.newRandom());
            return last(gradient.getGradientPoints());
        };

        //create the GUI interface for a color in the gradient
        createUI = (function(){
            var i = 0;
            return function(gradPoint){
                var folder = gui.addFolder('Color '+((i++)+1));
                addTColor(folder,gradPoint,'color').onChange(onChange);
                folder.add(gradPoint.getColor(),'_alpha',0,1.0).step(0.01).name('alpha').onChange(onChange);
                folder.add(gradPoint,'pos',range.getAt(0),range.getAt(1)).onChange(onChange);
                folder.open();
            };
        })();


        exports.addColor = function(){
            createUI( addGradientPoint() );
            onChange();
        };
        gui.add( exports, 'toLinearGradientCSS').name('To CSS');
        gui.add( exports, 'addColor' ).name('Add A Color');
        //add any possible pre-exisitng colors
        each(options.gradient.getGradientPoints(), createUI);
        return exports;
    };

    createGradient = function(){

        var container = document.getElementById('example-container'),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            gradient = new ColorGradient(),
            range,
            exports = {};



        var toLinearGradientCSS = (function(){
            //find out if there should be a vendor prefix
            var styles = window.getComputedStyle(document.documentElement, ''),
                pre = (Array.prototype.slice
                    .call(styles)
                    .join('')
                    .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
                    )[1];

            return function( grad, width, angle ){
                angle = angle || "left";
                var stops = [];
                each(grad.getGradientPoints(), function(gradPoint){
                    stops.push(gradPoint.getColor().toRGBACSS() +' '+Math.round((gradPoint.getPosition()/width)*100)+'%');
                });

                console.log( 'stops: ', stops);
                var css = "";
                var stopsStr = stops.toString();
                css += '-'+pre+'-linear-gradient(' +angle+ ', ' +stopsStr+ ')';
                return css;
            };
        })();

        window.gradient = gradient;
        window.toLinearGradientCSS = toLinearGradientCSS;
        canvas.width = window.innerWidth;
        canvas.height = 1;
        if( window.devicePixelRatio >= 2 ){
            canvas.style.width = canvas.width + 'px';
            canvas.width *= 2;
        }

        range = new FloatRange(0, canvas.width);

        canvas.style.webkitTransformOrigin = 'top left';
        canvas.style.webkitTransform = 'scaleY('+(window.innerHeight-50)+')';
        container.style.height = (window.innerHeight - 50) + 'px';
        container.style.position = 'relative';
        container.style.top = '-15px';
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        window.canv = canvas;

        //generate a palette using the "Split Complementary" strategy
        //and a random saturated color
        (function createGradient(strategy, positions){
            strategy
                .createListFromColor(TColor.newRandom().setSaturation(0.8))
                .each(function(color,i){
                    gradient.addColorAt(range.getAt(positions[i]), color);
                });
        })(colorTheoryRegistry.SPLIT_COMPLEMENTARY, [0,0.35,0.6,0.75,0.85,1.0]);

        var div = document.createElement('div');
        div.style.width = '200px';
        div.style.height = '75px';
        div.style.position = 'absolute';
        div.style.boxShadow = '4px 4px 8px rgba(0,0,0,0.5)';
        div.style.top = '40px';
        div.style.left = '20px';
        div.style.paddingLeft = "4px";
        div.style.border = '4px solid black';
        div.style.color = 'black';
        div.style.fontWeight = 'bold';
        div.style.fontSize = '10px';
        div.innerHTML = "CSS linear-gradient";



        var posComparator = function(a,b){
            return internals.numberComparator(a.getPosition(),b.getPosition());
        };
        container.appendChild( canvas );
        container.appendChild( div );

        exports.render = function(){
            //sort the gradient by each colors position
            gradient.getGradientPoints().sort(posComparator);
            div.style.backgroundImage = toLinearGradientCSS( gradient, canvas.width );
            var imageData = ctx.createImageData(canvas.width,1);
            var list = gradient.calcGradient(0,canvas.width);
            for( var i=0, l = list.size(); i<l; i++ ){
                list.colors[i].toRGBADecimalArray(imageData.data, 4*i);
            }
            ctx.putImageData(imageData,0,0);
        };

        exports.range = range;
        exports.gradient = gradient;
        exports.toLinearGradientCSS = toLinearGradientCSS;

        exports.render();

        return exports;
    };


    return function(){
        var sketch = createGradient();
        buildGui({
            gradient: sketch.gradient,
            range: sketch.range,
            onChange: sketch.render,
            toLinearGradientCSS: sketch.toLinearGradientCSS
        });
    };
});
