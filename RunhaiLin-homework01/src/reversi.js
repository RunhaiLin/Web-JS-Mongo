// reversi.js
// RunhaiLin

function repeat(value,n){
	const arr = Array(n).fill(value);
	return arr;
}

function generateBoard(rows, columns, initialCellValue){
	let fillin;
	if (typeof initialCellValue === "undefined" ){
		fillin = "";
	} else {
		fillin = initialCellValue;
	}

	return repeat(fillin,rows*columns);

}

function rowColToIndex(board, rowNumber, columnNumber){

	const l = Math.sqrt(board.length);
	return rowNumber*l + columnNumber;
}

function indexToRowCol(board, i){
	const l = Math.sqrt(board.length);
	const rc = {"row":undefined,"col":undefined};
	rc["row"] = Math.floor(i/l);
	rc["col"] = i - rc["row"]*l;
	return rc;
}

function setBoardCell(board, letter, row, col){
	const index = rowColToIndex(board,row,col);
	const updatedboard = board.slice(0,board.length);
	updatedboard[index] = letter;
	return updatedboard;
}

function algebraicToRowCol(algebraicNotation){
	if (algebraicNotation.length < 2 ||algebraicNotation.length >3){
		return undefined;
	}
	const letter = algebraicNotation[0];
	const num = algebraicNotation.substring(1);
	const rc = {"row":undefined,"col":undefined};

	//the ASCII number of A is 65 and Z is 90
	if (letter.charCodeAt(0) >= 65 && letter.charCodeAt(0)<=90){
		rc["col"] = letter.charCodeAt(0) - 65;
	} else{
		return undefined;
	}

	//the ASCII number of 0 is 48 and 9 is 57
	if (num.length === 1){
		if (num.charCodeAt(0) <48 || num.charCodeAt(0)>57 ){
			return undefined;
		}
	}

	if (num.length ===2){
		if (num.charCodeAt(0) <48 || num.charCodeAt(0)>57 ){
			return undefined;
		}

		if (num.charCodeAt(1) <48 || num.charCodeAt(1)>57 ){
			return undefined;
		}
	}

	const numCast = +num;

	if (isNaN(numCast)){
		return undefined;
	} else if (numCast<1 && numCast>26){
			return undefined;
		} else{
			rc["row"] = numCast-1;
		}

	return rc;
}

function placeLetters(board, letter, ...algebraicNotation){
	let updatedboard = board;
	const alglen = algebraicNotation.length;
	//row, column collector
	let algRC;
	for (let i = 0;i<alglen;i++){
		algRC =algebraicToRowCol(algebraicNotation[i]);
		updatedboard = setBoardCell(updatedboard,letter,algRC["row"],algRC["col"]);
	}

	return updatedboard;
}

function boardToString(board){
	const l = Math.sqrt(board.length);
	let boardstring ="";
	let firstline = "  ";
	let midline = "";
	let floor = "";

	//build firstline
	for (let fl = 0;fl<l;fl++){
		//the ASCII number of A is 65 and Z is 90
		//so start from 65
		const letter = String.fromCodePoint(fl+65);
		firstline += "   ";
		firstline += letter;
	}
	firstline += "  \n";

	//build floor
	floor += "   +";
	for (let f = 0;f<l;f++){
		floor += "---+";
	}
	floor += "\n";

	boardstring += (firstline + floor);

	//build midline 
	for (let r = 0;r<l;r++){
		if (r<9){
			midline = " "+((r+1)+"")+" |";
		} else{
			midline = " "+((r+1)+"")+"|";
		}
		
		for (let c = 0; c<l;c++){
			//find the index for the block in the rth row and in the cth column
			const index = rowColToIndex(board,r,c);
			midline += " "+board[index]+" |";
		}
		midline += "\n";
		midline += floor;
		boardstring += midline;
	}
	return boardstring;
}

function isBoardFull(board){
	for (let i =0;i<board.length;i++){
		if (board[i] === " "){
			return false;
		}
	}
	return true;

}

function flip(board,row,col){
	const index = rowColToIndex(board,row,col);
	if (board[index] === " "){
		return board;
	} 
	
	if (board[index] === "X"){
		board[index] = "O";
		return board;
	}
	if (board[index] === "O"){
		board[index] = "X";
		return board;
	}
}

function flipCells(board, cellsToFlip){
	for (let gid = 0;gid < cellsToFlip.length;gid++){
		const group = cellsToFlip[gid];
		for (let cid = 0;cid<group.length;cid++){
			const cell = group[cid];
			const row = cell[0];
			const col = cell[1];
			board = flip(board,row,col);
		}
	}
	return board;
}

function getCellsToFlip(board, lastRow, lastCol){
	const l = Math.sqrt(board.length);
	const index = rowColToIndex(board,lastRow,lastCol);
	const color = board[index];
	const oppo = (color === "X") ? "O" : "X";
	const cellsToFlip = [];

	//check up
	let row = lastRow;
	let col = lastCol;
	let group = [];
	let flag = false;
	let i = index;
	let c = color;
	let cell =[];
	while (row>=1){

		row--;
		//the current cell i (index) c (color)
		i = rowColToIndex(board,row,col);
		c = board[i];


		// if curent cell is empty or the same, end the loop
		if (c !== oppo&& c!== " "){
			flag = true;
			break;
		} else{
			cell = [row,col];
			group.push(cell);
		}
	}
	if (flag&& group.length>0){
	cellsToFlip.push(group);
	}

	//check down
	row = lastRow;
	col = lastCol;
	group = [];
	flag = false;
	i = index;
	c = color;
	cell =[];
	while (row<=l-2){
		row++;
		//the current cell i (index) c (color)
		i = rowColToIndex(board,row,col);
		c = board[i];

		// if curent cell is empty or the same, end the loop
		if (c !== oppo&& c!== " "){
			flag = true;
			break;
		} else{
			cell = [row,col];
			group.push(cell);
		}
	}
	if (flag&& group.length>0){
	cellsToFlip.push(group);
	}

	//check left
	row = lastRow;
	col = lastCol;
	group = [];
	flag = false;
	i = index;
	c = color;
	cell =[];
	while (col>=1){
		col--;
		//the current cell i (index) c (color)
		i = rowColToIndex(board,row,col);
		c = board[i];

		// if curent cell is empty or the same, end the loop
		if (c !== oppo&& c!== " "){
			flag = true;
			break;
		} else{
			cell = [row,col];
			group.push(cell);
		}
	}
	if (flag&& group.length>0){
	cellsToFlip.push(group);
	}

	//check right
	row = lastRow;
	col = lastCol;
	group = [];
	flag = false;
	i = index;
	c = color;
	cell =[];
	while (col<=l-2){
		col++;
		//the current cell i (index) c (color)
		i = rowColToIndex(board,row,col);
		c = board[i];

		// if curent cell is empty or the same, end the loop
		if (c !== oppo && c!== " "){
			flag = true;
			break;
		} else{
			cell = [row,col];
			group.push(cell);
		}
	}
	if (flag && group.length>0){
	cellsToFlip.push(group);
	}


	//check upper left diag
	row = lastRow;
	col = lastCol;
	group = [];
	flag = false;
	i = index;
	c = color;
	cell =[];
	while (col>=1 && row>=1){
		col--;
		row--;
		//the current cell i (index) c (color)
		i = rowColToIndex(board,row,col);
		c = board[i];

		// if curent cell is empty or the same, end the loop
		if (c !== oppo&& c!== " "){
			flag = true;
			break;
		} else{
			cell = [row,col];
			group.push(cell);
		}
	}
	if (flag && group.length>0){
	cellsToFlip.push(group);
	}

	//check upper right diag
	row = lastRow;
	col = lastCol;
	group = [];
	flag = false;
	i = index;
	c = color;
	cell =[];
	while (col<=l-2 && row>=1){
		col++;
		row--;
		//the current cell i (index) c (color)
		i = rowColToIndex(board,row,col);
		c = board[i];

		// if curent cell is empty or the same, end the loop
		if (c !== oppo&& c!== " "){
			flag = true;
			break;
		} else{
			cell = [row,col];
			group.push(cell);
		}
	}
	if (flag&& group.length>0){
	cellsToFlip.push(group);
	}

	//check lower left diag
	row = lastRow;
	col = lastCol;
	group = [];
	flag = false;
	i = index;
	c = color;
	cell =[];
	while (col>=1 && row<=l-2){
		col--;
		row++;
		//the current cell i (index) c (color)
		i = rowColToIndex(board,row,col);
		c = board[i];

		// if curent cell is empty or the same, end the loop
		if (c !== oppo&& c!== " "){
			flag = true;
			break;
		} else{
			cell = [row,col];
			group.push(cell);
		}
	}
	if (flag&& group.length>0){
	cellsToFlip.push(group);
	}

	//check lower right diag
	row = lastRow;
	col = lastCol;
	group = [];
	flag = false;
	i = index;
	c = color;
	cell =[];
	while (col<=l-2 && row<=l-2){
		col++;
		row++;
		//the current cell i (index) c (color)
		i = rowColToIndex(board,row,col);
		c = board[i];

		// if curent cell is empty or the same, end the loop
		if (c !== oppo&& c!== " "){
			flag = true;
			break;
		} else{
			cell = [row,col];
			group.push(cell);
		}
	}
	if (flag&& group.length>0){
	cellsToFlip.push(group);
	}


	return cellsToFlip;

}



function isValidMove(board, letter, row, col)
{
	const l = Math.sqrt(board.length);
	if (row>=l || col>=l){
		return false;
	}

	const index = rowColToIndex(board,row,col);
	if (board[index] !== " "){
		return false;
	}



	const oppo = (letter === "X") ? "O" : "X";

	let left = col - 1;
	let right = col + 1;
	let up = row - 1;
	let down = row + 1;

	

	//to left
	if (left>=0 && board[rowColToIndex(board,row,left)] === oppo){
		while (left>=0)
			{	
				if (board[rowColToIndex(board,row,left)] === " " )
					{
						break;
					}
				if (board[rowColToIndex(board,row,left)] === letter )
					{
						return true;
					}
				left --;
			}
	}

	//to right
	left = col - 1;
	right = col + 1;
	up = row - 1;
	down = row + 1;
	if (right<=l-1 && board[rowColToIndex(board,row,right)] === oppo){



		while (right<=l-1)
			{	
				
				if (board[rowColToIndex(board,row,right)] === " " )
					{
						break;
					}
				if (board[rowColToIndex(board,row,right)] === letter )
					{
						return true;
					}
				right++;
			}
	}

	//to up
	left = col - 1;
	right = col + 1;
	up = row - 1;
	down = row + 1;
	if (up>=0 && board[rowColToIndex(board,up,col)] === oppo){
		while (up>=0)
			{	
				if (board[rowColToIndex(board,up,col)] === " " )
					{
						break;
					}
				if (board[rowColToIndex(board,up,col)] === letter )
					{
						return true;
					}
				up--;
			}
		
	}

	//to down
	left = col - 1;
	right = col + 1;
	up = row - 1;
	down = row + 1;
	if (down<=l-1 && board[rowColToIndex(board,down,col)] === oppo){
		while (down<=l-1)
			{	
				if (board[rowColToIndex(board,down,col)] === " " )
					{
						break;
					}
				if (board[rowColToIndex(board,down,col)] === letter )
					{
						return true;
					}
				down++;
			}
	}
	//up left
	left = col - 1;
	right = col + 1;
	up = row - 1;
	down = row + 1;
	if (left>=0 && up>= 0 && board[rowColToIndex(board,up,left)] === oppo){
		while (left>=0 && up>= 0)
			{	
				if (board[rowColToIndex(board,up,left)] === " " )
					{
						break;
					}
				if (board[rowColToIndex(board,up,left)] === letter )
					{
						return true;
					}
				up--;
				left--;
			}
	}
	//up right
	left = col - 1;
	right = col + 1;
	up = row - 1;
	down = row + 1;
	if (right<=l-1 && up>= 0 && board[rowColToIndex(board,up,right)] === oppo){
		while (right<=l-1 && up>= 0 )
			{	
				if (board[rowColToIndex(board,up,right)] === " " )
					{
						break;
					}
				if (board[rowColToIndex(board,up,right)] === letter )
					{
						return true;
					}
				up--;
				right++;
			}
	}
	//down left
	left = col - 1;
	right = col + 1;
	up = row - 1;
	down = row + 1;
	if (left>=0 && down<= l-1 && board[rowColToIndex(board,down,left)] === oppo){
		while (left>=0 && down<= l-1)
			{	
				if (board[rowColToIndex(board,down,left)] === " " )
					{
						break;
					}
				if (board[rowColToIndex(board,down,left)] === letter )
					{
						return true;
					}
				down++;
				left--;
			}
	}
	//down right 
	left = col - 1;
	right = col + 1;
	up = row - 1;
	down = row + 1;
	if (right<=l-1 && down<= l-1 && board[rowColToIndex(board,down,right)] === oppo){
		while (right<=l-1 && down<= l-1)
			{	
				if (board[rowColToIndex(board,down,right)] === " " )
					{
						break;
					}
				if (board[rowColToIndex(board,down,right)] === letter )
					{
						return true;
					}
				down++;
				right++;
			}
	}
	return false;
}

// width = 4
// let board = generateBoard(width,width," ");
// 	const mid = width/2;
// 	board = setBoardCell(board,"O",mid-1,mid-1);
// 	board = setBoardCell(board,"O",mid,mid);
// 	board = setBoardCell(board,"X",mid-1,mid);
// 	board = setBoardCell(board,"X",mid,mid-1);
// 	let boardshow = boardToString(board);
// 	console.log(boardshow);

// 	console.log(isValidMove(board,"X",1,0));
// 	board = placeLetters(board,"X","D3");
// 	boardshow = boardToString(board);
// 	console.log(boardshow);



function isValidMoveAlgebraicNotation(board, letter, algebraicNotation){
	const rc = algebraicToRowCol(algebraicNotation);
	
	if (rc === undefined){
		return false;
	}
	return isValidMove(board,letter,rc["row"],rc["col"]);
}

function getLetterCounts(board){
	const count = {"X":0,"O":0};
	for (let i = 0; i<board.length;i++){
		if (board[i]==="X"){
			count["X"] ++;
		}

		if (board[i]==="O"){
			count["O"] ++;
		}
	}
	return count;
}

function getValidMoves(board, letter){
	const vm = [];
	for (let i = 0;i<board.length;i++){
		const rc = indexToRowCol(board,i);
		const row = rc["row"];
		const col = rc["col"];
		if (isValidMove(board,letter,row,col)){
			vm.push([row,col]);
		}
	}
	return vm;
}

module.exports = {
	repeat:repeat,
	generateBoard:generateBoard,
	rowColToIndex:rowColToIndex,
	indexToRowCol:indexToRowCol,
	setBoardCell:setBoardCell,
	algebraicToRowCol: algebraicToRowCol,
	placeLetters:placeLetters,
	boardToString:boardToString,
	isBoardFull:isBoardFull,
	flip:flip,
	flipCells:flipCells,
	getCellsToFlip:getCellsToFlip,
	isValidMove:isValidMove,
	isValidMoveAlgebraicNotation:isValidMoveAlgebraicNotation,
	getLetterCounts:getLetterCounts,
	getValidMoves:getValidMoves

};

