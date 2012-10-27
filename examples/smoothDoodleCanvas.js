window.onload = init;
var gui = new dat.GUI();
var canvas, ctx,spline;
var points, lastSplineVertices;
var sampleDistance = 50;

var params = {
	distance: 50,
	tightness: 0.25
};

function init(){
	canvas = document.getElementById('example');
	canvas.style.backgroundColor = "white";
	ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 100;
	spline = new toxi.geom.Spline2D();
	points = [];
	
	
	//controls
	gui.add( params, 'distance', 5, 200 );
	gui.add( params, 'tightness', 0.001, 0.5).step(0.025).onChange(function(){
		spline.setTightness( params.tightness );
	});

	gui.add({
		clear: function(){ ctx.clearRect(0,0,canvas.width,canvas.height); }
	}, 'clear');

	
	//
	
	window.onmousemove = function(e){
		update(e.pageX,e.pageY);
	};
	
}


function update(mouseX,mouseY){
	 var numP=points.length;
		 var currP=new toxi.geom.Vec2D(mouseX,mouseY);
		 
		 if (numP>0) {
		 
  		 var prevP=points[numP-1];
  		 if (currP.distanceTo(prevP)> params.distance) {
  		 	points.push(currP);
  		 	ctx.strokeStyle = "rgba(0,0,0,0.5)";
  		 	ctx.beginPath();
  		 	ctx.arc(currP.x,currP.y,3,0,Math.PI*2);
  		 	ctx.stroke();
  		 	ctx.closePath();
  		 	spline.add(currP);
  		 	if (numP > 1) {
  		 		var lastP = points[numP-2];
    			var p = points[numP-1];
    			line(lastP.x,lastP.y,p.x,p.y);
    			ctx.strokeStyle = "rgba(0,0,0,0.5)";
    			ctx.arc(p.x,p.y,7,0,Math.PI*2);
    		}
    		
    		// need at least 4 vertices for a spline
    		if (numP>3) {
     			ctx.strokeStyle = "rgba(0,0,0,.125)";
    			// sample the curve at a higher resolution
    			// so that we get extra 8 points between each original pair of points
    			var vertices=spline.computeVertices(8);
			    // draw the smoothened curve
			    ctx.beginPath();
			    var numRecent = Math.max(vertices.length-64,0);
			    for(var i=numRecent;i<vertices.length;i++) {
			      var v = vertices[i];
			      if(i == numRecent){
			      	ctx.moveTo(v.x,v.y);
			      }
			      else {
			      	ctx.lineTo(v.x,v.y); 
			      }
			   
			    }
			    ctx.stroke();
			    ctx.closePath();
			    lastVertices = vertices;
			}
		}
	}
	else {
		points.push(currP);
	}
}


function line(x1,y1,x2,y2){
	ctx.beginPath();
	ctx.strokeStyle = "rgba(255,0,0,0.25)";
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
	ctx.closePath();
}




document.ontouchmove = function(e){
	e.preventDefault(); //prevents scrolling
	for(var i=0;i<e.touches.length;i++){
		update(e.touches[i].pageX,e.touches[i].pageY);
	}
}