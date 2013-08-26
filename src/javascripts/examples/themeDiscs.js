define([
    'd3',
    'dat/gui/GUI',
    'toxi/internals',
    'toxi/geom/Vec3D',
    'toxi/color'
], function( d3, datGui, internals, Vec3D, color ){

    var each = internals.each,
        gui = new datGui();

    var paletteDescription = {
        'soft ivory': 0.5,
        'intense goldenrod': 0.25,
        'warm saddlebrown': 0.15,
        'fresh teal': 0.05,
        'bright yellowgreen': 0.05
    };
    var createPalette = function( descriptors, numColors ){
        var theme = new color.ColorTheme('discs');
        each( descriptors, function( weight, descriptor ){
            theme.addRange(descriptor, weight);
        });
        theme.addRange( color.ColorRange.BRIGHT, color.TColor.newRandom(), Math.random(0.02, 0.05) );
        return theme.getColors(numColors);
    };

    return function(){

        var w = window.innerWidth,
            h = window.innerHeight-50,
            maxScale = 100,
            minScale = 10;


        var settings = {
            num: 300,
            sort: false,
            primaryCriteria: "HUE",
            secondaryCriteria: "BRIGHTNESS",
            clusterSort: function( numClusters ){
                numClusters = numClusters || 10;
                if( !settings.list ){
                    return;
                }
                settings.list.clusterSort(
                    color.AccessCriteria[settings.primaryCriteria],
                    color.AccessCriteria[settings.secondaryCriteria],
                    numClusters
                );
                var clusterLength = settings.list.size() / numClusters;
                var slices = [];
                for( var i=0; i<numClusters; i++){
                    var start = i*clusterLength;
                    slices.push(settings.list.colors.slice(start,start+clusterLength));
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
                        return (w/numClusters) * indices[0];
                    })
                    .attr('cy', function(d){
                        var indices = findInCluster(d.color);
                        return (h/slices[0].length) * indices[1];
                    })
                    .each('end', function(){
                        d3.select(this)
                            .transition()
                            .duration(1000)
                            .attr('r', 12);
                    });
            },
            unSort: function(){
                console.log('unSort: ', svg.selectAll('circle') );
                svg.selectAll('circle')
                    .transition()
                    .delay(function(d,i){ return i * 10; })
                    .duration(1000)
                    .ease('elastic')
                    .attr('r', function(d){ return d.vec3.z; })
                    .attr('cx', function(d){ return d.vec3.x; })
                    .attr('cy', function(d){ return d.vec3.y; });
            },
            reset: function(){
                var count = 0;
                var circles = settings.remove();
                circles
                    .remove()
                    .each(function(){ ++count; })
                    .each("end", function(){
                        if(!--count){
                            settings.list = create(svg, settings.num);
                            settings.updateSort();
                        }
                    });
               /*circles.each('end',function(d,i){
                    if( i === svg.selectAll('circle').size()-1 ){
                        console.log( 'last one!');
                        create( svg, settings.num );
                    }
                });*/
            },
            updateSort: function(){
                settings[ settings.sort ? 'clusterSort' : 'unSort' ]();
            },
            remove: function(){
               return svg.selectAll('circle')
                    .transition()
                    .delay(function(d,i){ return i; })
                    .duration(1000)
                    .attr('r', 0);
            }
        };
        window.settings = settings;
        //Initialize the Gui
        gui.add(settings,'num',50,500);
        gui.add(settings, 'remove');
        gui.add(settings, 'reset');
        gui.add(settings,'sort').onChange(function(){
            settings.updateSort();
        });

        gui.add(settings, 'primaryCriteria', Object.keys(color.AccessCriteria)).onChange(function(){
            settings.updateSort();
        });
        gui.add(settings, 'secondaryCriteria', Object.keys(color.AccessCriteria)).onChange(function(){
            settings.updateSort();
        });


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
            var list = createPalette(paletteDescription, num),
                nodes = list.colors.map(function(color, i){
                    return {
                        vec3: new Vec3D(Math.random()*w, Math.random()*h, (Math.random()*(maxScale-minScale)) + minScale),
                        color: color.setAlpha(Math.random())
                    };
                });

            window.colorList = list;

            nodes.forEach(function(node){
                console.log( node.vec3.z );
            });

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

        settings.list = create( svg, settings.num );
        settings.updateSort();
    };
/*    return function(){
        var $container = $('#example-container');
        var swatch = {
            width: window.innerWidth/10,
            height: window.innerHeight/10,
            gap: 1
        };

        var settings = {
            maxSize: 150,
            rows: 20,
            columns: 20,
            numDiscs: 300
        };

        $container.height( window.innerHeight );

        list.each(function(color){
            var $sw = $('<div/>')
                .addClass('swatch')
                .css({
                    float: 'left',
                    width: window.innerWidth/settings.columns,
                    height: window.innerHeight/settings.rows,
                    'background-color': color.toRGBCSS()
                });
            $container.append($sw);
        });
    };
*/
});
