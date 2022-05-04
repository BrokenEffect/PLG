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
var current_move_blocks = 0;
var current_if_blocks = 0;
var current_loop_blocks = 0;

var input1_text;

//var commands = [ifcommand.bind(null,"ENEMY_ABOVE",[moveleft],[moveup])];
//var commands = [loopcommand.bind(null,6,[ifcommand.bind(null,"ENEMY_ABOVE",[moveleft],[moveup])])]
//var commands = [ifcommand("ENEMY_ABOVE",moveleft,moveup)];
//var commands = [loopcommand.bind(null,4,[moveright]),moveup];
var commands = [];
	//These Two variables are used to render the text for the command list.
var commands_text = '';
var commands_list_text = [];
var commands_type = [];
var temp_type = [];

  //This is for the current coin amount text
var coins_collected_text = '';

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
var loop_num_max = 10;  //I arbitrarily chose 10, it can be adjusted later.

//Variables Used to Keep Track of Adding Loop to Commands List
var if_status = 0;
var if_status_text = '';
var if_temp = '';
var if_true = [];
var if_true_text = '';
var if_true_list_text = [];
var if_else = [];
var if_else_text = '';
var if_else_list_text = [];
var if_cond_list = ['ENEMY_ABOVE', 'ENEMY_BELOW'];
var if_cond_list_text = ['Enemy Above', 'Enemy Below'];
var if_cond_num = 0;
var if_cond_text = '';

//allocates a 50x50 grid, only the tiles being used will be displayed
var tiles = [];
for (var i = 0; i < MAX_SIZE; i++) {
	tiles[i] = []
	for (var j = 0; j < MAX_SIZE; j++){
		tiles[i][j] = SPACE;
	}
}

//Level Variables
const levels = [];	//List of levels
var lvl_index = 0;	//level iterator

//Text Var to Display Level Number
var lvl_text = '';
var lvl_temp = 0;

//Keeps Track of whether the instructions screen is open.
var instructions_open = 0;
var instructions_text = '';

	//Keep Track of Menu Screen
var play_click = false;


//---------------- PRELOAD FUNCTION -------------------
//NOTE: lvl-config.txt loads list of levels in order from top to bottom. To add a level, place the txt file name in the desired position in lvl-config.txt. Then place the txt file in the levels directory.
let lvlConfig_data;
var lvlName;
let player_img;
let enemy_img;
let goal_img;
let coin_img;

const lvl_data = [];
function preload() {
	lvlConfig_data = loadStrings('./levels/lvl-config.txt');
	player_img = loadImage('./Graphics/Player.png');
	enemy_img = loadImage('./Graphics/Spikes.png');
	goal_img = loadImage('./Graphics/Flag2.png');
	coin_img = loadImage('./Graphics/Coin.png');
}

//---------------- SETUP LEVELS -------------------
function lvl_setup(){
	lvlConfig_data.pop();	//Removes extra space that is for some reason there.
	for (var i = 0; i < lvlConfig_data.length; i++){
		levels.push(lvlConfig_data[i]);
	}
	for (var i = 0; i < lvlConfig_data.length; i++){
		lvlName = "./levels/" + lvlConfig_data[i];
		loadStrings(lvlName, addLvl);
	}
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

		/*
	//Button examples
	button1 = createButton('click me');
	button1.position(10, 100);
	button1.mousePressed(button1Pressed);
	//
	input1 = createInput("type here",type="text");
	input1_text = "type here";
	input1.size(80);
	input1.input(input1Changed); //text is stored in the global variable: input1_text
	input1.position(10,150)
	//
	button2 = createButton('<- print that');
	button2.position(100, 150);
	button2.mousePressed(button2Pressed);
		*/

		/* ### Buttons For Title Screen ### */

	//Play Button
	mainPlayButton = createButton('Play');
	mainPlayButton.position(930, 200);
	mainPlayButton.mousePressed(mainPlayButtonPressed);

	//View Instructions
	instructionsButton = createButton('View Instructions');
	instructionsButton.position(200, 200);
	instructionsButton.mousePressed(instructionsPressed);

	/* ### Buttons to Add Commands ### */
			/* MovementCommands */
	//MoveUpButton
	moveUpButton = createButton('Add Move Up');
	moveUpButton.position(200, 250);
	moveUpButton.mousePressed(moveUpButtonPressed);
	//MoveDownButton
	moveDownButton = createButton('Add Move Down');
	moveDownButton.position(200, 275);
	moveDownButton.mousePressed(moveDownButtonPressed);
	//MoveLeftButton
	moveLeftButton = createButton('Add Move Left');
	moveLeftButton.position(200, 300);
	moveLeftButton.mousePressed(moveLeftButtonPressed);
	//MoveRightButton
	moveRightButton = createButton('Add Move Right');
	moveRightButton.position(200, 325);
	moveRightButton.mousePressed(moveRightButtonPressed);
			/* Loop Commands */
	//BeginForLoopButton
	beginForLoopButton = createButton('Begin For Loop');
	beginForLoopButton.position(200, 375);
	beginForLoopButton.mousePressed(beginForLoopPressed);
	//EndForLoopButton
	endForLoopButton = createButton('Close For Loop');
	endForLoopButton.position(200, 400);
	endForLoopButton.mousePressed(endForLoopPressed);
	//IncrementLoopNumButton
	incLoopNumButton = createButton('Add Loop Iteration');
	incLoopNumButton.position(200, 425);
	incLoopNumButton.mousePressed(incLoopNumPressed);
	//DecrementLoopNumButton
	decLoopNumButton = createButton('Remove Loop Iteration');
	decLoopNumButton.position(200, 450);
	decLoopNumButton.mousePressed(decLoopNumPressed);
			/* If Commands */
	//BeginIfButton
	beginIfButton = createButton('Begin If Statement');
	beginIfButton.position(200, 500);
	beginIfButton.mousePressed(beginIfPressed);
	//EndIfButton
	endIfButton = createButton('Continue / Close If Statement');
	endIfButton.position(200, 525);
	endIfButton.mousePressed(endIfPressed);
	//IncIfCondButton
	incIfCondButton = createButton('Change If Condition (Increment)');
	incIfCondButton.position(200, 550);
	incIfCondButton.mousePressed(incIfCondPressed);
	//DecIfCondButton
	decIfCondButton = createButton('Change If Condition (Decrement)');
	decIfCondButton.position(200, 575);
	decIfCondButton.mousePressed(decIfCondPressed);

		/*Remove Last Command */
	//RemoveLastCommandButton
	removeCommandButton = createButton('Remove Last Command');
	removeCommandButton.position(200, 625);
	removeCommandButton.mousePressed(removeCommandPressed);

		/* Run Commands */
	runCommandsButton = createButton('Run Commands');
	runCommandsButton.position(200, 650);
	runCommandsButton.mousePressed(runCommandsPressed);

  	//
	colorMode(HSB, 360, 100, 100); //changes color mode to HSB (aka HSL)
}


//---------------- START LEVEL -------------------


function start_level(lIndex){

	curr_Width = lvl_data[lIndex][0].length;

	//Get height based off symbols
	curr_Height = 0;
	for(var i = 0; i < lvl_data[lIndex].length - 1; i++){
		if (isNaN(lvl_data[lIndex][i][0]) && !(lvl_data[lIndex][i][0] == "-")){
			curr_Height += 1;
		}
	}

	tmp_data_str = lvl_data[lIndex].join(",").replaceAll(",","");
	const coin_pos = [...tmp_data_str.matchAll("c")];
	const enemy_pos = [...tmp_data_str.matchAll("e")];
	const goal_pos = [...tmp_data_str.matchAll("g")];
	const wall_pos = [...tmp_data_str.matchAll("#")];

	set_pos(coin_pos, COIN);
	set_pos(enemy_pos, ENEMY);
	set_pos(goal_pos, GOAL);
	allowed_move_blocks = lvl_data[lIndex][curr_Height + 1];
	allowed_if_blocks = lvl_data[lIndex][curr_Height + 2];
	allowed_loop_blocks = lvl_data[lIndex][curr_Height + 3];
	coin_goal = lvl_data[lIndex][curr_Height + 4];

	//Set player position
	var player_pos = tmp_data_str.indexOf("p");
	var tmp_row = Math.floor(player_pos / curr_Width);
	var tmp_val = tmp_row * curr_Width;
	var tmp_col = player_pos - tmp_val;
	p = new player(tmp_col, tmp_row);

	set_pos(wall_pos, WALL);

}

function clear_lvl(){ // clears the level so old levels don't bleed into the next ones
  for (var i = 0; i < MAX_SIZE; i++) {
	tiles[i] = [];
		for (var j = 0; j < MAX_SIZE; j++){
			tiles[i][j] = SPACE;
		}
	}
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
	if (play_click == true) {
		if (instructions_open == 0) {
			to_be_drawn = "NONE";
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
						to_be_drawn = COIN;
					} else if (tiles[i][j] == GOAL){
						fill(204,70,92);
						to_be_drawn = GOAL;
					} else if (tiles[i][j] == ENEMY){
						fill(0,70,90); //this one is red, for example
						to_be_drawn = ENEMY;
					}

					if(i==p.x && j == p.y){ //filling in players spot
						fill(145,70,90);
						to_be_drawn = PLAYER;
					}
					//stroke(0,0,100);  //White Stroke
					//stroke('#FF8F00');  //Test Color - Should be Orange
					stroke('#000000');  //Black Stroke
					rect(cWidth/2+i*scl-(curr_Width*scl/2),cHeight/2+j*scl-(curr_Height*scl/2),scl,scl);
					if(to_be_drawn == PLAYER){
						image(player_img,cWidth/2+i*scl-(curr_Width*scl/2),cHeight/2+j*scl-(curr_Height*scl/2));
					} 
					else if (to_be_drawn == COIN){
						image(coin_img,cWidth/2+i*scl-(curr_Width*scl/2),cHeight/2+j*scl-(curr_Height*scl/2));
					}
					else if (to_be_drawn == ENEMY){
						image(enemy_img,cWidth/2+i*scl-(curr_Width*scl/2),cHeight/2+j*scl-(curr_Height*scl/2));
					}
					else if (to_be_drawn == GOAL){
						image(goal_img,cWidth/2+i*scl-(curr_Width*scl/2),cHeight/2+j*scl-(curr_Height*scl/2));
					}
					
					to_be_drawn = "NONE";
					//rect(i*scl,j*scl,scl,scl);
				}
			}
		}
	}

	/* ### Hiding / Showing Elements Based on Level Index ### */
	if (instructions_open == 0) {
		if (play_click == true) {
			/* ### Showing Button Elements ### */
			moveUpButton.show();
			moveDownButton.show();
			moveLeftButton.show();
			moveRightButton.show();
			beginForLoopButton.show();
			endForLoopButton.show();
			incLoopNumButton.show();
			decLoopNumButton.show();
			beginIfButton.show();
			endIfButton.show();
			incIfCondButton.show();
			decIfCondButton.show();
			removeCommandButton.show();
			runCommandsButton.show();
			instructionsButton.show();

			/* ### Hiding Main Menu Buttons */
			mainPlayButton.hide();

			/* ###  Text Elements  ### */
				//Text to show Level Number
			lvl_temp = lvl_index + 1;
			lvl_text = 'Level: ' + lvl_temp;
			fill('#FFFFFF');  //White Fill - HTML Color Code #FFFFFF
			stroke('#000000');  //Black Stroke - HTML Color Code #000000
			textSize(24);
			textWrap(WORD);
			text(lvl_text, 730, 140, 300);

				//Text to above Command Buttons
			textSize(14);
			textWrap(WORD);
			text('Add Commands:', 50, 140, 200);

				//Show Current And Available Move Commands
			textSize(14);
			textWrap(WORD);
			text('Current / Maximum Move Commands: ' + current_move_blocks + "/" + allowed_move_blocks, 1200, 140, 350);
			//Show Current And Available Loop Commands
			textSize(14);
			textWrap(WORD);
			text('Current / Maximum For Loops: ' + current_loop_blocks + "/" + allowed_loop_blocks, 1200, 165, 350);
			//Show Current And Available Loop Commands
			textSize(14);
			textWrap(WORD);
			text('Current / Maximum If Statements: ' + current_if_blocks + "/" + allowed_if_blocks, 1200, 190, 350);

				//Draw Text for Commands Added to Command List
			commands_text = 'Commands Added:\n';
			if (commands_list_text.length != 0) {
				for(var k = 0; k < commands_list_text.length; k++) {
					commands_text = commands_text + commands_list_text[k] + '\n';  //Adding Command Text to List
					/*
					if (k != (commands_list_text.length - 1)) {
						commands_text = commands_text + ', '
					}
					*/
				}
			} else {
				commands_text = commands_text + 'None'
			}
			//fill('#FFFFFF');  //White Fill - HTML Color Code #FFFFFF
			//stroke('#000000');  //Black Stroke - HTML Color Code #000000
			textSize(14);
			textWrap(WORD);
			text(commands_text, 250, 50, 1550);
				//Draw Text for Loop Status
			loop_status_text = 'Loop Status: ';
			if (loop_status == false) {
				loop_status_text = loop_status_text + 'Closed';
			} else {
				loop_status_text = loop_status_text + 'Open';
			}
			textSize(14);
			textWrap(WORD);
			text(loop_status_text, 50, 725, 1550);
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
				textSize(14);
				textWrap(WORD);
				text(loop_add_text, 50, 750, 1550);
					//Draw Text for Loop Num
				loop_num_text = 'Number of Loop Iterations: ' + loop_num;
				textSize(14);
				textWrap(WORD);
				text(loop_num_text, 50, 775, 1550);
			}
				//Only Draw If Texts if if is Open
			if (if_status == 0) {
				if_status_text = 'If Status: Closed';
			} else if (if_status == 1) {
				if_status_text = 'If Status: Open. Adding Commands for True';
			} else if (if_status == 2) {
				if_status_text = 'If Status: Open. Adding Commands for False';
			}
			textSize(14);
			textWrap(WORD);
			text(if_status_text, 50, 800, 1550);
			if ((if_status == 1)||(if_status == 2)) {
				if_true_text = 'If (True) Commands Added: ';
				if (if_true_list_text.length != 0) {
					for (var m = 0; m < if_true_list_text.length; m++) {
						if_true_text = if_true_text + if_true_list_text[m];
						if (m != (if_true_list_text.length - 1)) {
							if_true_text = if_true_text + ', ';
						}
					}
				} else {
					if_true_text = if_true_text + 'None';
				}
				textSize(14);
				textWrap(WORD);
				text(if_true_text, 50, 825, 1550);
			}
			if ((if_status == 2)||(if_status == 1)) {
				if_else_text = 'If (False) Commands Added: ';
				if (if_else_list_text.length != 0) {
					for (var m = 0; m < if_else_list_text.length; m++) {
						if_else_text = if_else_text + if_else_list_text[m];
						if (m != (if_else_list_text.length - 1)) {
							if_else_text = if_else_text + ', ';
						}
					}
				} else {
					if_else_text = if_else_text + 'None';
				}
				textSize(14);
				textWrap(WORD);
				text(if_else_text, 50, 850, 1550);
			}
			if ((if_status == 1)||(if_status == 2)) {
				if_cond_text = 'If Condition: ';
				if_cond_text = if_cond_text + if_cond_list_text[if_cond_num];  //Can make this look nicer later.
				textSize(14);
				textWrap(WORD);
				text(if_cond_text, 50, 875, 1550);
			}
		} else {
				/* ### Showing Main Menu Buttons ### */
				mainPlayButton.show();

				/* ### Main Menu Text Elements ### */
				fill('#FFFFFF');
				stroke('#000000');  //Black Stroke - HTML Color Code #000000
				textSize(24);
				textWrap(WORD);
				text('Welcome to PLG!', 700, 140, 400);

				/* ### Hiding Button Elements ### */
				moveUpButton.hide();
				moveDownButton.hide();
				moveLeftButton.hide();
				moveRightButton.hide();
				beginForLoopButton.hide();
				endForLoopButton.hide();
				incLoopNumButton.hide();
				decLoopNumButton.hide();
				beginIfButton.hide();
				endIfButton.hide();
				incIfCondButton.hide();
				decIfCondButton.hide();
				removeCommandButton.hide();
				runCommandsButton.hide();
				instructionsButton.hide();
		}
	} else {
		//Hiding All other buttons
		moveUpButton.hide();
		moveDownButton.hide();
		moveLeftButton.hide();
		moveRightButton.hide();
		beginForLoopButton.hide();
		endForLoopButton.hide();
		incLoopNumButton.hide();
		decLoopNumButton.hide();
		beginIfButton.hide();
		endIfButton.hide();
		incIfCondButton.hide();
		decIfCondButton.hide();
		removeCommandButton.hide();
		runCommandsButton.hide();

		//Instructions Button is the only one that should be showing.
		instructionsButton.show();

		//Instructions Text
		instructions_text = 'Instructions: \nYour goal is to collect all coins and reach the goal without touching an of the enemies / traps.'
		+ '\nIn order to collect coins and reach the goal. You must give the player a list of commands to execute.'
		+ '\nYou can give the player commands by using buttons on the left side of the screen.'
		+ '\nThe basic move commands are: Move Up, Move Down, Move Left, Move Right.'
		+ '\nYou can have the player execute a series of commands by using a for loop.'
		+ '\nOpen a for loop by pressing the Begin For Loop button. You can then add basic move commands to the for loop.'
		+ '\nYou can increment or decrement the number of times the commands in the loop will be run by using the Add Loop Iteration and Remove Loop Iteration buttons.'
		+ '\nYou can close the loop using the Close For Loop buttons.'
		+ '\nYou can give the player conditional commands using If Statements in a way similar to a for loop.'
		+ '\nIf statements have two command lists for True and False cases. Opening an If Statement will allow you to add commands to the True Statement Command List.'
		+ '\nYou can add commands to the False List by clicking the Continue / Close If Statement. You can close the If Statement by clicking Continue / Close again.'
		+ '\nClick the Remove Command button to remove the last command in the active command list.'
		+ '\nRun the commands list by clicking the Run Commands button.'
		+ '\nClick the View Instructions button to return to the game.';

		fill('#FFFFFF');
		stroke('#000000');  //Black Stroke - HTML Color Code #000000
		textSize(14);
		textWrap(WORD);
		text(instructions_text, 400, 140, 800);
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
	//Spencer: I changed this to need the coin goal for the goal to work we can change it back for debugging
	if (tiles[p.x][p.y] == GOAL && p.coin_goal_reached == true){ //player is on the goal
		p.goal_reached = true;
		console.log("Goal Reached!");
		//TODO:  maybe display a "Level Complete" message and then return to level selection screen or next level
		console.log("Moving to next level...")
		lvl_index += 1;
		if (lvl_index >= levels.length){
			console.log("Game Over (out of levels)"); //Add functionality for game over
		}
		else {
			clear_lvl();
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
	if (p.goal_reached && p.coin_goal_reached){ // changed from or to and
		console.log("Algorithm successful!");
		commands = [];
		commands_list_text = [];
		commands_type = [];
		current_move_blocks = 0;
		current_loop_blocks = 0;
		current_if_blocks = 0;
	} else {
		//console.log("Algorithm failed!");
		commands = [];
		commands_list_text = [];
		commands_type = [];
		current_move_blocks = 0;
		current_loop_blocks = 0;
		current_if_blocks = 0;

		start_level(lvl_index); //restart level on unsuccessful algorithm and resets command list on fail or win
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

	if(key== ' ') {
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

//Button and Input Examples
		/*
function button1Pressed() {
  console.log("You clicked me!");
}
function input1Changed() {
	input1_text = this.value();
}
function button2Pressed() {
  console.log(input1_text);
}
	*/

/* ### Functions For Title Screen ### */
		//MainPlayButtonPressed - Called on Play Button Pressed
function mainPlayButtonPressed() {
	play_click = true;
}

		//InstructionsPressed
function instructionsPressed() {
	if (instructions_open == 1) {
		instructions_open = 0;
	} else {
		instructions_open = 1;
	}
}

/* ### Functions For Adding Commands ### */
		//AddMoveUp - For Add Move Up Button
function moveUpButtonPressed() {
	if (current_move_blocks >= allowed_move_blocks) {
		console.log('Max Number of Move Blocks Already Reached');
	} else {
		current_move_blocks += 1;
	 	if (loop_status == true) {
			console.log('Adding Move Up to Loop Commands List...');
			loop_add.push(moveup);
			loop_add_list_text.push("Move Up");
		} else if (if_status == 1) {
			console.log('Adding Move Up to If True List...');
			if_true.push(moveup);
			if_true_list_text.push("Move Up");
		} else if (if_status == 2) {
			console.log('Adding Move Up to If False List...');
			if_else.push(moveup);
			if_else_list_text.push("Move Up");
		} else {
			console.log('Adding Move Up to Commands List...');
			commands.push(moveup);
			commands_list_text.push("Move Up");
			commands_type.push(['M']);
		}
	}
}
		//AddMoveDown - For Add Move Down Button
function moveDownButtonPressed() {
	if (current_move_blocks >= allowed_move_blocks) {
		console.log('Max Number of Move Blocks Already Reached');
	} else {
		current_move_blocks += 1;
		if (loop_status == true) {
			console.log('Adding Move Down to Loop Commands List...');
			loop_add.push(movedown);
			loop_add_list_text.push("Move Down");
		} else if (if_status == 1) {
			console.log('Adding Move Down to If True List...');
			if_true.push(movedown);
			if_true_list_text.push("Move Down");
		} else if (if_status == 2) {
			console.log('Adding Move Down to If False List...');
			if_else.push(movedown);
			if_else_list_text.push("Move Down");
		} else {
			console.log('Adding Move Down to Commands List...');
			commands.push(movedown);
			commands_list_text.push("Move Down");
			commands_type.push(['M']);
		}
	}
}
		//AddMoveLeft - For Add Move Left Button
function moveLeftButtonPressed() {
	if (current_move_blocks >= allowed_move_blocks) {
		console.log('Max Number of Move Blocks Already Reached');
	} else {
		current_move_blocks += 1;
		if (loop_status == true) {
			console.log('Adding Move Left to Loop Commands List...');
			loop_add.push(moveleft);
			loop_add_list_text.push("Move Left");
		} else if (if_status == 1) {
			console.log('Adding Move Left to If True List...');
			if_true.push(moveleft);
			if_true_list_text.push("Move Left");
		} else if (if_status == 2) {
			console.log('Adding Move Left to If False List...');
			if_else.push(moveleft);
			if_else_list_text.push("Move Left");
		} else {
			console.log('Adding Move Left to Commands List...');
			commands.push(moveleft);
			commands_list_text.push("Move Left");
			commands_type.push(['M']);
		}
	}
}
		//AddMoveRight - For Add Move Right Button
function moveRightButtonPressed() {
	if (current_move_blocks >= allowed_move_blocks) {
		console.log('Max Number of Move Blocks Already Reached');
	} else {
		current_move_blocks += 1;
		if (loop_status == true) {
			console.log('Adding Move Right to Loop Commands List...');
			loop_add.push(moveright);
			loop_add_list_text.push("Move Right");
		} else if (if_status == 1) {
			console.log('Adding Move Right to If True List...');
			if_true.push(moveright);
			if_true_list_text.push("Move Right");
		} else if (if_status == 2) {
			console.log('Adding Move Right to If False List...');
			if_else.push(moveright);
			if_else_list_text.push("Move Right");
		} else {
			console.log('Adding Move Right to Commands List...');
			commands.push(moveright);
			commands_list_text.push("Move Right");
			commands_type.push(['M']);
		}
	}
}
			//RemoveCommandPressed - For Remove Command Button
function removeCommandPressed() {
	if (loop_status == true) {
		if (loop_add.length > 0) {
			console.log('Removing Last Loop Command. Last Loop Command Was:');
			loop_add.pop();
			console.log(loop_add_list_text.pop());
			current_move_blocks -= 1;
		} else {
			console.log('Loop Commands List is Already Empty...');
		}
	} else if (if_status == 1) {
		if (if_true.length > 0) {
			console.log('Removing Last If True Command. Last Command Was:');
			if_true.pop();
			console.log(if_true_list_text.pop());
			current_move_blocks -= 1;
		} else {
			console.log('If True List is Already Empty...');
		}
	} else if (if_status == 2) {
		if (if_else.length > 0) {
			console.log('Removing Last If False Command. Last Command Was:');
			if_else.pop();
			console.log(if_else_list_text.pop());
			current_move_blocks -= 1;
		} else {
			console.log('If False List is Already Empty...');
		}
	} else {
		if (commands.length > 0) {
			console.log('Removing Last Command. Last Command Was:');
			commands.pop();
			console.log(commands_list_text.pop());
			temp_type = commands_type.pop();
			if (temp_type[0] == 'M') {
				current_move_blocks -= 1;
			}
			if (temp_type[0] == 'F') {
				current_loop_blocks -= 1;
				current_move_blocks -= temp_type[1];
			}
			if (temp_type[0] == 'I') {
				current_if_blocks -= 1;
				current_move_blocks -= temp_type[1];
				current_move_blocks -= temp_type[2];
			}
		} else {
			console.log('Commands List is Already Empty...');
		}
	}
}
		//BeinForLoopPressed - Used to Open For Loop
function beginForLoopPressed() {
	if (if_status != 0) {
		console.log('If Statement Already Open');
	} else if (loop_status == true) {
		console.log('Loop is Already Open...');
	} else if (current_loop_blocks >= allowed_loop_blocks) {
		console.log('Maximum Number of Loops Already Reached...');
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
			loop_add_temp = 'For(' + loop_num + ', [';
			for (var i = 0; i < loop_add_list_text.length; i++) {
				loop_add_temp = loop_add_temp + loop_add_list_text[i];
				if (i != (loop_add_list_text.length - 1)) {
					loop_add_temp = loop_add_temp + ', ';
				}
			}
			current_loop_blocks += 1;
			loop_add_temp = loop_add_temp + '])';
			console.log('Adding Loop Command to Commands List...');
			commands.push(loopcommand.bind(null, loop_num, loop_add));
			commands_list_text.push(loop_add_temp);
			commands_type.push(['F', loop_add.length()]);
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
		//BeginIfPressed - Used to begin creation of If Statement
function beginIfPressed() {
	if (loop_status == true) {
		console.log('For Loop is Already Open...');
	} else if ((if_status == 1) || (if_status == 2)) {
		console.log('If is Already Open...');
	} else if (current_if_blocks >= allowed_if_blocks) {
		console.log('Maximum Number of Ifs Already Reached...');
	} else {
		console.log('Opening If Statement...');
		if_status = 1;
	}
}
		//EndIfPressed - Used to Continue If Creation or Close It
function endIfPressed() {
	if (if_status == 0) {
		console.log('If is Already Closed...');
	} else if (if_status == 1) {
		if (if_true.length == 0) {
			console.log('No If Commands Added to True Case. Cancelling If Add and Closing If...');
			if_status = 0;
		} else {
			console.log('Continuing to Else Case...');
			if_status = 2;
		}
	} else {
		if_temp = 'If(' + if_cond_list_text[if_cond_num] + ', [';
		for (var i = 0; i < if_true_list_text.length; i++) {
			if_temp = if_temp + if_true_list_text[i];
			if (i != (if_true_list_text.length - 1)) {
				if_temp = if_temp + ', ';
			}
		}
		if_temp = if_temp + '], [';
		for (var i = 0; i < if_else_list_text.length; i++) {
			if_temp = if_temp + if_else_list_text[i];
			if (i != (if_else_list_text.length - 1)) {
				if_temp = if_temp + ', ';
			}
		}
		current_if_blocks += 1;
		if_temp = if_temp + '])';
		console.log('Adding If Command to Commands List...');
		commands.push(ifcommand.bind(null, if_cond_list[if_cond_num], if_true, if_else));
		commands_type.push(['I', if_true.length(), if_else.length()]);
		commands_list_text.push(if_temp);
		console.log('Resetting if Vars...');
		if_temp = '';
		if_cond_num = 0;
		if_true = [];
		if_true_list_text = [];
		if_else = [];
		if_else_list_text = [];
		console.log('Closing If Statement...');
		if_status = 0;
	}
}
		//IncIfCondPressed - Used to Increment If Condition List
function incIfCondPressed() {
	if ((if_status == 1) || (if_status == 2)) {
		if_cond_num += 1;
		if (if_cond_num >= if_cond_list.length) {
			if_cond_num = 0;
		}
	} else {
		console.log('If Statement is Closed...');
	}
}
		//DecIFCondPressed - Used to Decrement If Condition List
function decIfCondPressed() {
	if ((if_status == 1) || (if_status == 2)) {
		if_cond_num -= 1;
		if (if_cond_num < 0) {
			if_cond_num = if_cond_list.lenght - 1;
		}
	} else {
		console.log('If Statement is Closed...');
	}
}

		//RunCommandsPressed - Runs the Command List
function runCommandsPressed() {
	console.log("Running Commands List");
	run_commands();
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