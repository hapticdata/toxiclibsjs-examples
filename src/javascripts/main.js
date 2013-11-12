require(['./config'], function(){
	require(['jquery','common'], function($){
		//don't load the js until the site loads, so that the views can grab their doms
		$(document).ready(function(){
			require(['site/index']);
		});
	});
});
