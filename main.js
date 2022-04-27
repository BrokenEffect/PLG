//---------- GLOBAL VARIABLES AND PREP ------------
//constants
const SPACE = '.';
const WALL = '#';
const PLAYER = 'p';
const GOAL = 'g';
const COIN = 'c';
const ENEMY = 'e';

//resolution stuffs
var scl = 30; //scale, how many pixels per square
var cWidth = 1600;
var cHeight = 900;


const MAX_SIZE = 50; //max size of grid, no levels bigger than 50x50 (not that we would make any..)

//current size of grid (10x10 for example)
var curr_Width;
var curr_Height;
var level_name; // stores level filename "test-level.txt", for example
var coin_goal; //goal for how many coins we need to collect, use -1 if not applicable
var allowed_move_blocks;
var allowed_if_blocks;
var allowed_loop_blocks;

var input1_text;

//var commands = [ifcommand.bind(null,"ENEMY_ABOVE",[moveleft],[moveup])];
//var commands = [loopcommand.bind(null,6,[ifcommand.bind(null,"ENEMY_ABOVE",[moveleft],[moveup])])]
//var commands = [ifcommand("ENEMY_ABOVE",moveleft,moveup)];
var commands = [loopcommand.bind(null,4,[moveright]),moveup];


//allocates a 50x50 grid, only the tiles being used will be displayed
var tiles = [];
for (var i = 0; i < MAX_SIZE; i++) {
	tiles[i] = []
	for (var j = 0; j < MAX_SIZE; j++){
		tiles[i][j] = SPACE;
	}
}


//---------------- SETUP FUNCTION -----------------
function setup() { //this gets called once at the start, as soon as the webpage is done loading
	canvas = createCanvas(cWidth, cHeight);
	canvas.parent('canvas-holder');
	b = new block(10,10);


	//Button examples
	button1 = createButton('click me');
  	button1.position(10, 700);
  	button1.mousePressed(button1Pressed);
  	//
  	input1 = createInput("type here",type="text");
  	input1_text = "type here";
	input1.size(80);
	input1.input(input1Changed); //text is stored in the global variable: input1_text
	input1.position(10,750)
	//
	button2 = createButton('<- print that');
  	button2.position(100, 750);
  	button2.mousePressed(button2Pressed);


  	//
	colorMode(HSB, 360, 100, 100); //changes color mode to HSB (aka HSL)
	start_level("test-level.txt");
}


//---------------- START LEVEL -------------------
// note: pass in a name like "test-level.txt" and it will
//			   begin setting up that level, then start the game


function start_level(level_name){

	//TODO: Actually import from our .txt instead of hard-coding like I did below
	curr_Width = 10;
	curr_Height = 10;
	coin_goal = 5;
	allowed_move_blocks = 5;

	p = new player(3,5); //creates the player at 4,5

	tiles[5][5] = COIN;
	//adds some game objects
	tiles[4][2] = ENEMY;
	tiles[6][6] = GOAL;
	tiles[2][7] = COIN;

	//makes walls
	for(var i = 0; i<curr_Width;i++){
		tiles[i][0] = WALL;
		tiles[i][9] = WALL;
	}
	for(var j = 0; j<curr_Height;j++){
		tiles[0][j] = WALL;
		tiles[9][j] = WALL;
	}

}



//---------------- DRAW -------------------
function draw () { // this function runs over and over at 60fps (or whatever we set our framerate to)
	
	background(0, 0, 21); //background color 
	b.update();

	for (var i = 0; i < curr_Width; i++){
		for (var j=0; j<curr_Height;j++){

			if (tiles[i][j] == SPACE){
				fill(0, 0, 21); //these fill() commands are just color values
			} else if (tiles[i][j] == WALL){
				fill(0,0,100);
				/*
			} else if (tiles[i][j] == PLAYER){
				fill(145,70,90);
				*/
			} else if (tiles[i][j] == COIN){
				fill(55,60,90);
			} else if (tiles[i][j] == GOAL){
				fill(204,70,92);
			} else if (tiles[i][j] == ENEMY){
				fill(0,70,90); //this one is red, for example
			}

			if(i==p.x && j == p.y){ //filling in players spot
				fill(145,70,90);
			}
			stroke(0,0,100);
			rect(cWidth/2+i*scl-(curr_Width*scl/2),cHeight/2+j*scl-(curr_Height*scl/2),scl,scl);
			//rect(i*scl,j*scl,scl,scl);
		}
		
	}
}



//---------------- UPDATE GRID -------------------
function update_grid() { //this is essentially the game loop, its kind of turn-based, 
												 // getting called after each action like the player moving

	//do some turn-based operations, like checking if the player is ontop of a coin now, etc.
	if (tiles[p.x][p.y] == COIN){ //player is on a coin
		tiles[p.x][p.y] = SPACE;
		p.coins_collected += 1;
		console.log(p.coins_collected);
		if(p.coins_collected == coin_goal){ //if we've gotten all coins
			p.coin_goal_reached = true;
			console.log("Coin Goal Reached!");
		}
	}
	if (tiles[p.x][p.y] == GOAL){ //player is on the goal
		p.goal_reached = true;
		console.log("Goal Reached!");
		//TODO:  maybe display a "Level Complete" message and then return to level selection screen or next level
	}
	if (tiles[p.x][p.y] == ENEMY){ //this will probably be moved somewhere else when enemy AI (if any) is implemented

		p.dead = true;
		console.log("You Died!");
		start_level("test-level.txt"); //restarts the level
	}
	
	
}

//------------ RUN COMMANDS ---------------------
// note: this function runs all of the instructions in the commands array in order
async function run_commands() {
	for(var i = 0;i<commands.length;i++){
			commands[i]();
			update_grid();
			await sleep(400);
		
	}
	if (p.goal_reached || p.coin_goal_reached){
		console.log("Algorithm successful!");
	} else {
		console.log("Algorihtm failed!");
	}
}
//-----------------------------------------------

// you don't need to know why this works
const sleep = (millis) => { 
    return new Promise(resolve => setTimeout(resolve, millis)) 
}


//this is only for debugging, we aren't going to control the player with arrow keys
function keyPressed() {
	if(keyCode === UP_ARROW) {
		moveup();
		update_grid();
	}
	else if(keyCode === DOWN_ARROW) {
		movedown();
		update_grid();
	}
	else if(keyCode === LEFT_ARROW) {
		moveleft();
		update_grid();
	}
	else if(keyCode === RIGHT_ARROW) {
		moveright();
		update_grid();
	}
	allowed_move_blocks -= 1;
	
	if(key== ' '){
		console.log("SPACE!");
		run_commands();
	}
}

// drag and drop example
function mousePressed() {
	b.clickCheck();
}

function mouseReleased() {
	b.release();
}


function button1Pressed() {
  console.log("You clicked me!");
}
function input1Changed() {
	input1_text = this.value();
}
function button2Pressed() {
  console.log(input1_text);
}



// COMMANDS LIST

function moveup(){
	if(tiles[p.x][p.y-1] != WALL){
		p.moveup();
	}
	
}
function movedown(){
	if(tiles[p.x][p.y+1] != WALL){
		p.movedown();
	}
}
function moveleft(){
	if(tiles[p.x-1][p.y] != WALL){
		p.moveleft();
	}
	
}
function moveright(){
	if(tiles[p.x+1][p.y] != WALL){
		p.moveright();
	}
}

//loops is the number of iterations
//command_list is the list of instructions we perform each loop iteration
function loopcommand(loops,command_list){
	for(var i=0; i<loops;i++){
		for(var j=0; j<command_list.length;j++){
			command_list[j]();
			update_grid();

		}
	}
	
}
//condition is a string to represent the condition, currently we are only checking for adjacent enemies
//command_list is the list of instructions to execute if the condition is TRUE
//command_list_else is the list of instructions to execute if the condition is FALSE
function ifcommand(condition,command_list,command_list_else){
	if(condition == "ENEMY_ABOVE"){
		if(tiles[p.x][p.y-1] == ENEMY){
			for(var j=0; j<command_list.length;j++){
				command_list[j]();
				update_grid();
			}
		} else {
			for(var j=0; j<command_list_else.length;j++){
				command_list_else[j]();
				update_grid();
			}
		}
	}
}