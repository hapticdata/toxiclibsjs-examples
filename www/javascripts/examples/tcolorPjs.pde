toxi.color.TColor c1;
toxi.color.TColor c2;

PFont font;

void setup()
{
	
	size(200,200);
	
	font = createFont("Arial",14);
	textFont(font);
	textSize(14);
	
	//setup colors
	c1 = toxi.color.TColor.newRGB(random(1),0,0);
	setNextColor();
	
	//NOTICE IM CHANGING THE COLOR MODE TO BE BETWEEN 0.0 - 1.0
	colorMode(RGB,1.0);
	

}

void draw()
{

	background(0);
	
	fill(c1.red(),c1.green(),c1.blue());
	rect(10,10,25,25);
	fill(c2.red(),c2.green(),c2.blue());
	rect(45,10,25,25);
	fill(1,1,1);
	text("blend between 2 colors",10,55);
	text("darken colors",10,110);
	text("desaturate colors", 10, 170);
	
	stroke(1,1,1);
	float mod = (frameCount%1000);
	float step = (mod/1000);
	if(step == 0.0){
		c1 = c2;
		setNextColor();
	}
	toxi.color.TColor c3 = c1.copy().blend(c2,step);
	fill(c3.red(),c3.green(),c3.blue());
	rect(80,10,110,25);
	
	toxi.color.TColor c1Dark = c1.copy().darken(step);
	toxi.color.TColor c2Dark = c2.copy().darken(step);
	fill(c1Dark.red(),c1Dark.green(),c1Dark.blue());
	rect(10,70,85,25);
	fill(c2Dark.red(),c2Dark.green(),c2Dark.blue());
	rect(105,70,85,25);
	
	toxi.color.TColor c1de = c1.copy().desaturate(step);
	toxi.color.TColor c2de = c2.copy().desaturate(step);
	fill(c1de.red(),c1de.green(),c1de.blue());
	rect(10,130,85,25);
	fill(c2de.red(),c2de.green(),c2de.blue());
	rect(105,130,85,25);
	
	noStroke();
	fill(0,0,0);
	rect(width-100,height-25,100,25);
	noFill();
	fill(1,1,1);
	text("step: "+step,width-80,height-10);
	
}

void setNextColor(){
	c2 = toxi.color.TColor.newHSV(random(1),1.0,1.0);
}