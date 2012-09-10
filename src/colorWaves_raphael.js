window.onload = function(e){
	
	
 		var columns = 6, rows = 4;
 		var columnWidth, rowHeight;
 		var circles = [];
 		var translateX = 100, translateY = 100;
 		var width =940;
 		var height = 600;
 		var container = document.getElementById("notepad");
		
		var notepad = Raphael(container,width,height);
		
		
		 columnWidth = width / (columns-1);
		 rowHeight = height / (rows-1);
		 
		 for(var r=0;r<rows;r++)
		 {
		     
		     for(var c=0;c<columns;c++)
		     {
		       var circle = notepad.circle(c*columnWidth+translateX,r*rowHeight+translateY,1,1);
		       circle.attr({fill: "#dddddd", "stroke": "#dddddd", "opacity":0.5,"scale": 4.0});
		       circles.push(circle); 
		     }
		   }
		   		   
		   
		document.addEventListener("mousemove",function(event)
		{
			updateFor(event.pageX,event.pageY);
		},false);
		
		document.addEventListener("touchmove",function(event){
			event.preventDefault();
			updateFor(event.touches[0].pageX,event.touches[0].pageY);
		
		},false);

		function updateFor(activeX,activeY)
		{

			var x = activeX - container.offsetLeft;
			var y = activeY - container.offsetTop;
			
			var l = circles.length;
			for(var i=0;i<l;i++)
			{
				var circle = circles[i];
				var box = circle.getBBox();
				var dx = x - box.x;
				var dy = y - box.y;
				var distance = Math.sqrt((dx * dx) + (dy * dy));
				var color = toxi.color.TColor.newHSV(distance/width,0.5,1.0);

				var rgba = "rgba("+(color.red()*255)+","+(color.green()*255)+","+(color.blue()*255)+","+color.alpha()+")";
				circle.attr({"fill": rgba, "scale":distance*0.25});
			}

		
		}
	}