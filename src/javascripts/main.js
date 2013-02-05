require(['domReady','common'], function( domReady ){
	//don't load the js until the site loads, so that the views can grab their doms
	domReady(function(){
		require(['site/index']);
	});
});