//-----------------------------------------------
//This is just a class for the player object
function player(x,y) {
	//member variables
	this.x = x;
	this.y = y;
	this.coins_collected = 0;
	this.coin_goal_reached = false;
	this.goal_reached = false;
	this.dead = false;


	// move functions
	this.moveup = function(){
		this.y -= 1;
	}
	this.movedown = function(){
		this.y += 1;
	}
	this.moveleft = function(){
		this.x -= 1;
	}
	this.moveright = function(){
		this.x += 1;
	}

	this.reset = function(){ //resets member variables, for a new level or after death, etc.
		this.coins_collected = 0;
		this.coin_goal_reached = false;
		this.goal_reached = false;
		this.dead = false;
	}
}
//-----------------------------------------------