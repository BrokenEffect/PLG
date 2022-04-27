//-----------------------------------------------
function block(x,y) {
	//member variables
	this.x = x;
	this.y = y;
	this.width = 100;
	this.height = 50;
	this.grabbed = false;
	this.xGrabbed;
	this.yGrabbed;


	this.update = function(){
		if(this.grabbed){
			//follow the mouse...
			this.x = mouseX-this.xGrabbed;
			this.y = mouseY-this.yGrabbed;

			// KEEPING WITHIN BOUNDARIES
			if(this.x<0){
				this.x=0;
			} else if (this.x>500){
				this.x=500;
			}
			if(this.y<0){
				this.y=0;
			} else if (this.y>cHeight-this.height){
				this.y=cHeight-this.height;
			}
		}

		fill(0,0,100);
		rect(this.x,this.y,this.width,this.height);
		fill(0);
		textSize(20);
		textFont("Courier New");
		strokeWeight(1);
		text("drag me",this.x+8,this.y+25)
	}

	this.clickCheck = function(){
		if (this.mouseIsInside()){
			this.grabbed = true;
			this.xGrabbed = mouseX-this.x;
			this.yGrabbed = mouseY-this.y;
		}
	}

	this.release = function(){
		this.grabbed = false;
	}

	this.mouseIsInside = function(){
		if( (mouseX>this.x) && mouseX< (this.x + this.width) && (mouseY>this.y) && mouseY < (this.y+this.height)){
			return true;
		} else {
			return false;
		}
	}
}
//-----------------------------------------------