// app.js
// Runhai Lin

const rev = require('./reversi.js');
const readlineSync = require('readline-sync');
const fs = require('fs');


// const answer = readlineSync.question('What is the meaning of life?');
// console.log(answer);

console.log("REVERSI?\n");

let scripted_or_not;

while(true){
	scripted_or_not = readlineSync.question("Do you want to use the scripted setting? (Answer only yes/no)\n");

	if (scripted_or_not === "yes" || scripted_or_not === "no" ){
		break;
	}
}


if (scripted_or_not === "yes"){
	let Setting;
	fs.readFile('./setting.json', 'utf8', function(err, data) {
 	if (err) {
  		console.log('uh oh', err); 
 	} else {
	 	Setting = JSON.parse(data);
	    const width = Setting["InitializedWidth"];
	    const playerletter = Setting["playerLetter"];
	    const scriptmove = Setting["scriptedMoves"]; 
    	play(width,playerletter,scriptmove);
 	}
	});
}

else{

	let width;
	while(true){
		width = readlineSync.question("How wide should the board be? (even numbers between 4 and 26, inclusive)\n");
		if (!isNaN(width)){
			if (width%2 === 0){
				
				if (width>=4 && width<=26){
					break;
				}
			}
		}
	}

	let playerletter;
	while (true){
		playerletter = readlineSync.question("Pick your letter: X (black) or O (white)\n");
		if (playerletter === "X" || playerletter === "O"){
			
			break;
		}
	}

	play(width,playerletter,null);


}




function play(w,p,s){
	const width = w;
	const playerletter = p;
	const scriptmove = s;
	const computerletter = (playerletter === "X") ? "O" : "X";


	//initialize the board
	let board = rev.generateBoard(width,width," ");
	const mid = width/2;
	board = rev.setBoardCell(board,"O",mid-1,mid-1);
	board = rev.setBoardCell(board,"O",mid,mid);
	board = rev.setBoardCell(board,"X",mid-1,mid);
	board = rev.setBoardCell(board,"X",mid,mid-1);
	let boardshow = rev.boardToString(board);
	

	//start game
	//1 who is taking the turn
	let playerturn = (playerletter === "X");
	let computerturn = (computerletter === "X");

	//2 should the game end
	let playerplayable = true;
	let computerplayable = true;
	let boardfull = rev.isBoardFull(board);
	let playable = (!boardfull ) &&(playerplayable || computerplayable);

	//3 available move
	let playermove = rev.getValidMoves(board,playerletter);
	let computermove = rev.getValidMoves(board,computerletter);

	//4 player answer, score and turn
	let playeranswer;
	let turn = 0;
	let score;
	let playerscore;
	let computerscore;

	//5 scriptmove
	let scriptflag = !(scriptmove ===null);

	//5 remind and some text
	const remind1 = "\nINVALID MOVE. Your move should:\n" + "* be in a  format\n" + "* specify an existing empty cell\n" + "* flip at elast one of your oponent's pieces\n";
	const remind2 = "No valid moves available for you.\n"+"Press <ENTER> to pass.\n";
	if (scriptflag){
		console.log("Computer will make the following moves: "+scriptmove[ "computer"]);
		console.log("The player will make the following moves: "+scriptmove[ "player"]);
	} 
	
	console.log("Player is "+playerletter);
	console.log(boardshow);

	//6 play 
	while (playable){
		if (playerturn){

			//first check whether there is script
			if (scriptflag){
				const playerscriptmov = scriptmove["player"][Math.floor(turn/2)];
				console.log("Player move to "+playerscriptmov+" is scripted.");
				readlineSync.question("Press <ENTER> to continue.");
				board = rev.placeLetters(board,playerletter,playerscriptmov);
				const rc = rev.algebraicToRowCol(playerscriptmov);
				const cellsToFlips = rev.getCellsToFlip(board,rc['row'],rc['col']);
				board = rev.flipCells(board,cellsToFlips);
			}
			else{

				//second check whether it is playermovable
				if (playerplayable){


					while (true){
						playeranswer = readlineSync.question("What's your move?\n");
						if (! rev.isValidMoveAlgebraicNotation(board, playerletter, playeranswer)){
							console.log(remind1);
						} else{
							break;
						}
					}
					board = rev.placeLetters(board,playerletter,playeranswer);
					const rc = rev.algebraicToRowCol(playeranswer);
					const cellsToFlips = rev.getCellsToFlip(board,rc['row'],rc['col']);
					board = rev.flipCells(board,cellsToFlips);

				} else{
					readlineSync.question(remind2);

				}
				


			}

			


		}

		if (computerturn){
			readlineSync.question("Press <ENTER> to show computer's move...");
			

			//first check whether there is script
			if (scriptflag){
				const computerscriptmov = scriptmove["computer"][Math.floor(turn/2)];
				console.log("Computer move to "+computerscriptmov+" was scripted.");
				
				board = rev.placeLetters(board,computerletter,computerscriptmov);
				const rc = rev.algebraicToRowCol(computerscriptmov);
				const cellsToFlips = rev.getCellsToFlip(board,rc['row'],rc['col']);
				board = rev.flipCells(board,cellsToFlips);
			}else{
				//second check whether it is playermovable


				

				if (computerplayable){
					
					const maxmovnumber = computermove.length;
					const movnumber = Math.floor(Math.random()*maxmovnumber);
					const computerrandommove = computermove[movnumber];
					const computerrow = computerrandommove[0];
					const computercol = computerrandommove[1];
					board = rev.setBoardCell(board,computerletter,computerrow ,computercol);

					
					const cellsToFlips = rev.getCellsToFlip(board,computerrow,computercol);

					board = rev.flipCells(board,cellsToFlips);

				}

				else{
					readlineSync.question("Computer has no valid moves. Press <ENTER> to continue");
				}
			}
		}

		//end of one turn

		//1 show score
		boardshow = rev.boardToString(board);
		console.log(boardshow);
		console.log("\n"+"Score\n"+"=====\n");
		score = rev.getLetterCounts(board);
		playerscore = score[playerletter];
		computerscore = score[computerletter];

		console.log("X: "+score["X"]);
		console.log("O: "+score["O"]);
		console.log();


		//2 count the script
		turn ++;
		if (scriptflag){
			scriptflag = (scriptmove["player"].length*2 >turn);
		}

		//3 swap turns
		playerturn = !playerturn;
		computerturn = !computerturn;

		//4 estimate whether the game is still playable
		boardfull = rev.isBoardFull(board);
		playermove = rev.getValidMoves(board,playerletter);
		computermove = rev.getValidMoves(board,computerletter);
		playerplayable = (playermove.length >0);
		computerplayable = (computermove.length>0);
		playable =(!boardfull ) &&(playerplayable || computerplayable);

	}

	//7 who is the winner
	if (playerscore>computerscore){
		console.log("You won!");
	} else{
		console.log("You lost!");
	}

}


