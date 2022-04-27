function moveup(){
	p.moveup();
}
function movedown(){
	p.movedown();
}
function moveleft(){
	p.moveleft();
}
function moveright(){
	p.moveright();
}

//loops is the number of iterations
//command_list is the list of instructions we perform each loop iteration
function loopcommand(loops,command_list){
	for(var i=0; i<loops;i++){
		for(var j=0; j<command_list.length;j++){
			command_list[j]();
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
			}
		} else {
			for(var j=0; j<command_list_else.length;j++){
				command_list_else[j]();
			}
		}
	}
}