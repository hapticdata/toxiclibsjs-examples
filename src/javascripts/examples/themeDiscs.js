//#Theme Discs
//**Usage:** Select _"view sorted"_  and adjust the _"Sorting Criteria"_ to sort the colors into
//clusters. Click _"Generate New"_ to create a new theme with a new random bright color added to the range.
//This demonstrates construction of `toxi.color.TColor` themes via textual descriptions of shades and Colors
//adding a random element to the theme.
define([
    'd3',
    'dat/gui/GUI',
    'toxi/internals',
    'toxi/geom/Vec3D',
    'toxi/color'
], function( d3, datGui, internals, Vec3D, color ){

    var each = internals.each,
        keys = internals.keys,
        mixin = internals.mixin,
        defaults,
        buildGui,
        create;

    defaults = {
        //build a ColorTheme with a ColorRange, NamedColor
        //and an arbitrary weight
        palette: {
            'soft ivory': 0.5,
            'intense goldenrod': 0.25,
            'warm saddlebrown': 0.15,
            'fresh teal': 0.05,
            'bright yellowgreen': 0.05
        },
        padding: 100,
        num: 200,
        sort: false,
        primaryCriteria: "HUE",
        secondaryCriteria: "BRIGHTNESS"
    };

    //Build the [dat-gui](http://workshop.chromeexperiments.com/examples/gui/)
    //interface with the instance of the application
    buildGui = function( app ){
        var gui = new datGui(),
            criterias = keys(color.AccessCriteria),
            sortingFolder = gui.addFolder('Sorting Criteria');

        each([
            sortingFolder
                .add(app, 'primaryCriteria', criterias)
                .name('Primary'),
            sortingFolder
                .add(app, 'secondaryCriteria', criterias)
                .name('Secondary'),
            gui.add(app,'sort')
                .name('View sorted')
        ],function(controller){
            controller.onChange(app.updateSort);
        });
        gui.add(app,'num',50,500).name('#');
        gui.add(app, 'reset').name('Generate New Theme');
        sortingFolder.open();
        return gui;
    };


    return function(){
        var app = themeDiscs( defaults );
        buildGui( app );
        return app;
    };

    function themeDiscs( options ){

        var app = {};
        mixin(app, options||{});

        var w = window.innerWidth,
            h = window.innerHeight-50,
            maxScale = 100,
            minScale = 10;

        app.clusterSort =  function( numClusters ){
            numClusters = numClusters || 10;
            if( !app.list ){
                return;
            }
            app.list.clusterSort(
                color.AccessCriteria[app.primaryCriteria],
                color.AccessCriteria[app.secondaryCriteria],
                numClusters
            );
            var clusterLength = app.list.size() / numClusters;
            var slices = [];
            for( var i=0; i<numClusters; i++){
                var start = i*clusterLength;
                slices.push(app.list.colors.slice(start,start+clusterLength));
            }
            var findInCluster = function( color ){
                var indices;
                slices.forEach(function(slice, i){
                    slice.forEach(function(c, j){
                        if( c.equals(color) ) {
                            indices = [i,j];
                        }
                    });
                });
                return indices;
            };
            svg.selectAll('circle')
                .transition()
                .delay(function(d,i){ return i*10; })
                .duration(1000)
                .attr('cx', function(d){
                    //find color
                    var indices = findInCluster(d.color);
                    return ((w-(app.padding*2))/(numClusters-1)) * indices[0] + app.padding;
                })
                .attr('cy', function(d){
                    var indices = findInCluster(d.color);
                    return ((h-(app.padding*2))/(slices[0].length-1)) * indices[1] + app.padding;
                })
                .each('end', function(){
                    d3.select(this)
                        .transition()
                        .duration(1000)
                        .attr('r', 12);
                });
        };
        app.unSort = function(){
            console.log('unSort: ', svg.selectAll('circle') );
            svg.selectAll('circle')
                .transition()
                .delay(function(d,i){ return i * 10; })
                .duration(1000)
                .ease('elastic')
                .attr('r', function(d){ return d.vec3.z; })
                .attr('cx', function(d){ return d.vec3.x; })
                .attr('cy', function(d){ return d.vec3.y; });
        };
        app.reset =  function(){
            var count = 0;
            var circles = app.remove();
            circles
                .remove()
                .each(function(){ ++count; })
                .each("end", function(){
                    if(!--count){
                        app.list = create(svg, app.num);
                        app.updateSort();
                    }
                });
        };
        app.updateSort = function(){
            app[ app.sort ? 'clusterSort' : 'unSort' ]();
        };
        app.remove = function(){
            return svg.selectAll('circle')
                .transition()
                .delay(function(d,i){ return i; })
                .duration(1000)
                .attr('r', 0);
        };
        window.app = app;


        var svg = d3.select('#example-container')
            .append('svg:svg')
            .attr('width', w)
            .attr('height', 0);
        window.svgInstance = svg;
        svg
            .transition()
            .duration(1000)
            .attr('height',h);




        var create = function( svg, num ){
            var theme = new color.ColorTheme('discs');
            each( app.palette, function( weight, descriptor ){
                theme.addRange(descriptor, weight);
            });
            theme.addRange( color.ColorRange.BRIGHT, color.TColor.newRandom(), Math.random(0.02, 0.05) );
            var list = theme.getColors(num),
                nodes = list.colors.map(function(color, i){
                    return {
                        vec3: new Vec3D(Math.random()*w, Math.random()*h, (Math.random()*(maxScale-minScale)) + minScale),
                        color: color.setAlpha(Math.random())
                    };
                });

            window.colorList = list;

            d3.select('#example-container')
                .style('background-color', list.getAverage().toHexCSS());

            svg
                .selectAll('circle')
                .data(nodes)
                .enter()
                .append('svg:circle')
                .attr('r', function(d){ return 0.0; })
                .attr('cx', function(d){ return d.vec3.x; })
                .attr('cy', function(d){ return d.vec3.y; })
                .style('fill', function(d){ return d.color.toRGBACSS(); })

            return list;
        };

        app.list = create( svg, app.num );
        app.updateSort();
        return app;
    };
});
