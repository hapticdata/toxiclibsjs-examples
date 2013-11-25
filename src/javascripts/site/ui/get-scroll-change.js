define(function( require ){
    var $ = require('jquery'),
        scrollLog = [],
        $w;
    $w = $(window);
    //get the amount of scroll change between the
    //last two positions, or optional position
    scrollLog.push( $w.scrollTop(), $w.scrollTop() );
    $w.on('scroll', function(){
        scrollLog.shift();
        scrollLog.push( $w.scrollTop() );
    });

    return function(pos){
        return ( typeof pos === 'number' ? pos : scrollLog[1] ) - scrollLog[0];
    };
});
