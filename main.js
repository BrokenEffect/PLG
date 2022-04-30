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
//var commands = [loopcommand.bind(null,4,[moveright]),moveup];
var commands = [];
	//These Two variables are used to render the text for the command list.
var commands_text = '';
var commands_list_text = [];

	//Variables Used to Keep Track of Adding Loop to Commands List
var loop_status = false;
var loop_status_text = '';
var loop_add = [];
var loop_add_text = '';
var loop_add_temp = '';
var loop_add_list_text = [];
var loop_num = 1;
var loop_num_text = '';
var loop_num_min = 1;
var loop_num_max = 10;  //I arbitrarily chose 10, it can be changed to more later.

//allocates a 50x50 grid, only the tiles being used will be displayed
var tiles = [];
for (var i = 0; i < MAX_SIZE; i++) {
	tiles[i] = []
	for (var j = 0; j < MAX_SIZE; j++){
		tiles[i][j] = SPACE;
	}
}

//List of levels
const levels = [];
var lvl_index = 0;

//---------------- PRELOAD FUNCTION -------------------
//NOTE: lvl-config.txt loads list of levels in order from top to bottom. To add a level, place the txt file name in the desired position in lvl-config.txt. Then place the txt file in the levels directory.
let lvlConfig_data;
var lvlName;
const lvl_data = [];
function preload() {
	lvlConfig_data = loadStrings('levels/lvl-config.txt');
	for (var i = 0; i < lvlConfig_data.length; i++){
		lvl_data.push(loadStrings("levels/" + lvlConfig_data[i]));
	}
}

//---------------- SETUP LEVELS -------------------
function lvl_setup(){
	for (var i = 0; i < lvlConfig_data.length; i++){
		levels.push(lvlConfig_data[i]);
	}
	for (var i = 0; i < lvlConfig_data.length; i++){
		lvlName = "levels/" + lvlConfig_data[i];
		loadStrings(lvlName, addLvl);
	}
	console.log("Current Levels: " + levels);
}

function addLvl(result) {
	lvl_data.push(result);
	if (lvl_data.length == lvlConfig_data.length){
		start_level(lvl_index);
	}
}


//---------------- SETUP FUNCTION -----------------
function setup() { //this gets called once at the start, as soon as the webpage is done loading
	canvas = createCanvas(cWidth, cHeight);
	canvas.parent('canvas-holder');
	//b = new block(10,10);

	//Perform level setup
	lvl_setup();


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

				/* ### Buttons to Add Commands ### */
		//MoveUpButton
		moveUpButton = createButton('Add Move Up');
		moveUpButton.position(200, 300);
		moveUpButton.mousePressed(moveUpButtonPressed);
		//MoveDownButton
		moveDownButton = createButton('Add Move Down');
		moveDownButton.position(200, 325);
		moveDownButton.mousePressed(moveDownButtonPressed);
		//MoveLeftButton
		moveLeftButton = createButton('Add Move Left');
		moveLeftButton.position(200, 350);
		moveLeftButton.mousePressed(moveLeftButtonPressed);
		//MoveRightButton
		moveRightButton = createButton('Add Move Right');
		moveRightButton.position(200, 375);
		moveRightButton.mousePressed(moveRightButtonPressed);
		//RemoveLastCommandButton
		removeCommandButton = createButton('Remove Last Command');
		removeCommandButton.position(200, 400);
		removeCommandButton.mousePressed(removeCommandPressed);
		//BeginForLoopButton
		beginForLoopButton = createButton('Begin For Loop');
		beginForLoopButton.position(200, 425);
		beginForLoopButton.mousePressed(beginForLoopPressed);
		//EndForLoopButton
		endForLoopButton = createButton('Close For Loop');
		endForLoopButton.position(200, 450);
		endForLoopButton.mousePressed(endForLoopPressed);
		//IncrementLoopNumButton
		incLoopNumButton = createButton('Add Loop Iteration');
		incLoopNumButton.position(200, 475);
		incLoopNumButton.mousePressed(incLoopNumPressed);
		//DecrementLoopNumButton
		decLoopNumButton = createButton('Remove Loop Iteration');
		decLoopNumButton.position(200, 500);
		decLoopNumButton.mousePressed(decLoopNumPressed);

  	//
	colorMode(HSB, 360, 100, 100); //changes color mode to HSB (aka HSL)
}


//---------------- START LEVEL -------------------
// note: pass in a name like "test-level.txt" and it will
//			   begin setting up that level, then start the game


function start_level(lIndex){

	curr_Width = lvl_data[lIndex][0].length;
	curr_Height = lvl_data[lIndex].length - 6;
	coin_goal = lvl_data[lIndex].join(",").match(/c/g).length;
	tmp_data_str = lvl_data[lIndex].join(",").replaceAll(",","");
	const coin_pos = [...tmp_data_str.matchAll("c")];
	const enemy_pos = [...tmp_data_str.matchAll("e")];
	const goal_pos = [...tmp_data_str.matchAll("g")];
	const wall_pos = [...tmp_data_str.matchAll("#")];

	set_pos(coin_pos, COIN);
	set_pos(enemy_pos, ENEMY);
	set_pos(goal_pos, GOAL);
	allowed_move_blocks = lvl_data[lIndex][curr_Height + 2];

	//Set player position
	var player_pos = tmp_data_str.indexOf("p");
	var tmp_row = Math.floor(player_pos / curr_Width);
	var tmp_val = tmp_row * curr_Width;
	var tmp_col = player_pos - tmp_val;
	p = new player(tmp_col, tmp_row);

	//makes walls --Should the walls automatically surround the level?
	for(var i = 0; i<curr_Width;i++){
		tiles[i][0] = WALL;
		tiles[i][curr_Height - 1] = WALL;
	}
	for(var j = 0; j<curr_Height;j++){
		tiles[0][j] = WALL;
		tiles[curr_Width - 1][j] = WALL;
	}
	set_pos(wall_pos, WALL);

}

function set_pos(data_pos, symbol){ //Finds coords based off index and sets the symbol to the coords in tiles
	for (var k = 0; k < data_pos.length; k++){
		var ind = data_pos[k].index;
		var row = Math.floor(ind / curr_Width);
		var tmp_val = row * curr_Width;
		var col = ind - tmp_val;
		tiles[col][row] = symbol;
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
			//stroke(0,0,100);  //White Stroke
			//stroke('#FF8F00');  //Test Color - Should be Orange
			stroke('#000000');  //Black Stroke
			rect(cWidth/2+i*scl-(curr_Width*scl/2),cHeight/2+j*scl-(curr_Height*scl/2),scl,scl);
			//rect(i*scl,j*scl,scl,scl);
		}
	}

	/* ###  Text Elements  ### */
		//Draw Text for Commands Added to Command List
	commands_text = 'Commands Added: ';
	if (commands_list_text.length != 0) {
		for(var k = 0; k < commands_list_text.length; k++) {
			commands_text = commands_text + commands_list_text[k];  //Adding Command Text to List
			if (k != (commands_list_text.length - 1)) {
				commands_text = commands_text + ', '
			}
		}
	} else {
		commands_text = commands_text + 'None'
	}
	stroke('#000000');  //Black Stroke - HTML Color Code #000000
	textSize(16);
	text(commands_text, 100, 750);
		//Draw Text for Loop Status
	loop_status_text = 'Loop Status: ';
	if (loop_status == false) {
		loop_status_text = loop_status_text + 'Closed';
	} else {
		loop_status_text = loop_status_text + 'Open';
	}
	textSize(16);
	text(loop_status_text, 100, 775);
		//Only Draw Loop Command and Loop Num Text if Loop Open
	if (loop_status == true) {
			//Draw Text for Loop Commands
		loop_add_text = 'Loop Commands Added: ';
		if (loop_add_list_text.length != 0) {
			for (var m = 0; m < loop_add_list_text.length; m++) {
				loop_add_text = loop_add_text + loop_add_list_text[m];
				if (m != (loop_add_list_text.length - 1)) {
					loop_add_text = loop_add_text + ', ';
				}
			}
		} else {
			loop_add_text = loop_add_text + 'None';
		}
		textSize(16);
		text(loop_add_text, 100, 800);
			//Draw Text for Loop Num
		loop_num_text = 'Number of Loop Iterations: ' + loop_num;
		textSize(16);
		text(loop_num_text, 100, 825);
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
		console.log("Moving to next level...")
		lvl_index += 1;
		if (lvl_index >= levels.length){
			console.log("Game Over (out of levels)"); //Add functionality for game over
		}
		else {
			start_level(lvl_index);
		}
	}
	if (tiles[p.x][p.y] == ENEMY){ //this will probably be moved somewhere else when enemy AI (if any) is implemented

		p.dead = true;
		console.log("You Died!");
		start_level(lvl_index); //restarts the level
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
/*
function mousePressed() {
	b.clickCheck();
}

function mouseReleased() {
	b.release();
}
*/

function button1Pressed() {
  console.log("You clicked me!");
}
function input1Changed() {
	input1_text = this.value();
}
function button2Pressed() {
  console.log(input1_text);
}

/* ### Functions For Adding Commands ### */
		//AddMoveUp - For Add Move Up Button
function moveUpButtonPressed() {
	if (loop_status == false) {
		console.log('Adding Move Up to Commands List...');
		commands.push(moveup);
		commands_list_text.push("Move Up");
	} else {
		console.log('Adding Move Up to Loop Commands List...');
		loop_add.push(moveup);
		loop_add_list_text.push("Move Up");
	}
}
		//AddMoveDown - For Add Move Down Button
function moveDownButtonPressed() {
	if (loop_status == false) {
		console.log('Adding Move Down to Commands List...');
		commands.push(movedown);
		commands_list_text.push("Move Down");
	} else {
		console.log('Adding Move Down to Loop Commands List...');
		loop_add.push(movedown);
		loop_add_list_text.push("Move Down");
	}
}
		//AddMoveLeft - For Add Move Left Button
function moveLeftButtonPressed() {
	if (loop_status == false) {
		console.log('Adding Move Left to Commands List...');
		commands.push(moveleft);
		commands_list_text.push("Move Left");
	} else {
		console.log('Adding Move Left to Loop Commands List...');
		loop_add.push(moveleft);
		loop_add_list_text.push("Move Left");
	}
}
		//AddMoveRight - For Add Move Right Button
function moveRightButtonPressed() {
	if (loop_status == false) {
		console.log('Adding Move Right to Commands List...');
		commands.push(moveright);
		commands_list_text.push("Move Right");
	} else {
		console.log('Adding Move Right to LoopCommands List...');
		loop_add.push(moveright);
		loop_add_list_text.push("Move Right");
	}
}
		//RemoveCommandPressed - For Remove Command Button
function removeCommandPressed() {
	if (loop_status == false) {
		if (commands.length > 0) {
			console.log('Removing Last Command. Last Command Was:');
			commands.pop();
			console.log(commands_list_text.pop());
		} else {
			console.log('Commands List is Already Empty...');
		}
	} else {
		if (loop_add.length > 0) {
			console.log('Removing Last Loop Command. Last Loop Command Was:');
			loop_add.pop();
			console.log(loop_add_list_text.pop());
		} else {
			console.log('Loop Commands List is Already Empty...');
		}
	}
}
		//BeinForLoopPressed - Used to Open For Loop
function beginForLoopPressed() {
	if (loop_status == true) {
		console.log('Loop is Already Open...');
	} else {
		console.log('Opening Loop...');
		loop_status = true;
	}
}
		//EndForLoopPressed - Used to Close For Loop
function endForLoopPressed() {
	if (loop_status == false) {
		console.log('Loop is Already Closed...');
	} else {
		if (loop_add.length == 0) {
			console.log('No Loop Commands Added. Cancelling Loop Add and Closing Loop...');
			loop_status = false;
		} else {
			console.log('Adding Loop Command to Commands List...');
			commands.push(loopcommand.bind(null, loop_num, loop_add));
			loop_add_temp = 'For(' + loop_num + ', [';
			for (var i = 0; i < loop_add_list_text.length; i++) {
				loop_add_temp = loop_add_temp + loop_add_list_text[i];
				if (i != (loop_add_list_text.length - 1)) {
					loop_add_temp = loop_add_temp + ', ';
				}
			}
			loop_add_temp = loop_add_temp + '])';
			commands_list_text.push(loop_add_temp);
			console.log('Resetting Loop Vars...');
			loop_num = 1;
			loop_add_temp = '';
			loop_add = [];
			loop_add_list_text = [];
			console.log('Closing Loop...');
			loop_status = false;
		}
	}
}
		//IncLoopNumPressed - Used to Increment the Number of Loop Iterations
function incLoopNumPressed() {
	if (loop_status == false) {
		console.log('Loop is Closed...');
	} else {
		loop_num += 1;
		if (loop_num > loop_num_max) {
			loop_num = loop_num_max;
			console.log('Over Max Number of Loop Iterations. Setting to Max...');
		} else {
			console.log('Incrementing Loop Num...');
		}
	}
}
		//DecLoopNumPressed - Used to Increment the Number of Loop Iterations
function decLoopNumPressed() {
	if (loop_status == false) {
		console.log('Loop is Closed...');
	} else {
		loop_num -= 1;
		if (loop_num < loop_num_min) {
			loop_num = loop_num_min;
			console.log('Under Min Number of Loop Iterations. Setting to Min...');
		} else {
			console.log('Decrementing Loop Num...');
		}
	}
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
