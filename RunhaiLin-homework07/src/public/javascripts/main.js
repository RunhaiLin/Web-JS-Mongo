document.addEventListener('DOMContentLoaded', main);

function main(){
	const playBtn = document.querySelector('.playBtn');

	playBtn.addEventListener('click', function(evt) {
     evt.preventDefault();

    const startvalue = document.querySelector("#startValues").value;
   	console.log(startvalue);

    const start = document.querySelector(".start");
    start.style.display = 'none';


    game(startvalue);
  });
}

function game(stv){
	class card{
		constructor(shape,num){
			this.shape = shape;
			this.num = num;
		}
	}

	let deck = new Array();
	let playerhand = new Array();
	let computerhand = new Array();
	const stvarr = stv.split(',');

	console.log(stvarr);

	for (let j = 1;j<=13;j++){
		for (let i = 1; i<=4; i++){

			let shu_shape;
			let shu_num;

			switch(i){
				case 1:
				shu_shape = "♦";
				break;
				case 2:
				shu_shape = "♠";
				break;
				case 3:
				shu_shape = "♥";
				break;
				case 4:
				shu_shape = "♣";
				break;
			}

			switch(j){
				case 1:
				shu_num = "A";
				break;
				case 2:
				shu_num = "2";
				break;
				case 3:
				shu_num = "3";
				break;
				case 4:
				shu_num = "4";
				break;
				case 5:
				shu_num = "5";
				break;
				case 6:
				shu_num = "6";
				break;
				case 7:
				shu_num = "7";
				break;
				case 8:
				shu_num = "8";
				break;
				case 9:
				shu_num = "9";
				break;
				case 10:
				shu_num = "10";
				break;
				case 11:
				shu_num = "J";
				break;
				case 12:
				shu_num = "Q";
				break;
				case 13:
				shu_num = "K";
				break;
			}

			let shuffledcard = new card(shu_shape,shu_num);
			deck.push(shuffledcard);

		}
	}
	//console.log(deck);


	//return the object of card based on the number
	function getcard(num){
		if (num === undefined || num === ""){
			return deck[Math.floor(Math.random() * deck.length)];
		}
		else{
			let filterdeck = deck.filter((ele)=>{
				return ele.num === num;
			})
			return filterdeck[0];
		}
	}

	//send two cards to playerhand and computer hand
	function drawcard(hand){
		const nextnum = stvarr.shift();
		const card = getcard(nextnum);
		hand.push(card);
		deck = deck.filter((ele) => {
			return ele !== card;
		} );

		
	}

	drawcard(playerhand);
	drawcard(computerhand);
	drawcard(playerhand);
	drawcard(computerhand);

	console.log(playerhand);
	console.log(computerhand);
	console.log(deck);

	//displaying the playerhand and computer hand
	function addvalue(card){
		if (card.num === 'A'){
			return 1;
		} else if (card.num === 'J' ||card.num === 'Q' || card.num === 'K'){
			return 10;
		} else {
			return (+card.num);
		}
	}

	function display(card,showing){
		let displaycard = document.createElement('div');
		displaycard.className = 'card';

		if (card === computerhand[0]){
			displaycard.className = 'unknowncard';
			displaycard.innerHTML = '<div class="num">'+"?"+'</div>'+'<div class="shape">'+ "?"+'</div>';
		} else{
			displaycard.innerHTML = '<div class="num">'+card.num+'</div>' +'<div class="shape">'+ card.shape+'</div>';
		}
		
		showing.appendChild(displaycard);
	}

	const computervalue = document.createElement('div');
	computervalue.className = "count";
	const computershowing = document.createElement('div');
	computershowing.className = "showing";


	let computercount = 0;
	for (let i = 0;i<computerhand.length;i++){
		computercount += addvalue(computerhand[i]);
		display(computerhand[i],computershowing);
	}
	computervalue.textContent = "Computer Hand - Total:?";
	document.body.appendChild(computervalue);
	document.body.appendChild(computershowing);



	const playervalue = document.createElement('div');
	playervalue.className = "count";
	const playershowing = document.createElement('div');
	playershowing.className = "showing";
	let playercount = 0;
	for (let i = 0;i<playerhand.length;i++){
		playercount += addvalue(playerhand[i]);
		display(playerhand[i],playershowing);
	}
	playervalue.textContent = "Player Hand - Total:"+playercount;
	document.body.appendChild(playervalue);
	document.body.appendChild(playershowing);



	//button part
	const form = document.createElement('form');
	const hit = document.createElement('INPUT');
	const stand = document.createElement('INPUT');
	form.name = "game button";
	form.className = "buttonform";
	form.method = "POST";
	form.action = "";

	hit.name = "hit";
	hit.value = "Hit";
	hit.type = "submit";
	hit.className = "button";

	stand.name = "stand";
	stand.value = "Stand";
	stand.type = "submit";
	stand.className = "button";
	form.appendChild(hit);
	form.appendChild(stand);
	document.body.appendChild(form);
	
	//hit
	hit.addEventListener('click',function(evt){
		evt.preventDefault();
		drawcard(playerhand);
		display(playerhand[playerhand.length-1],playershowing);
		playercount += addvalue(playerhand[playerhand.length-1]);
		playervalue.textContent = "Player Hand - Total:"+playercount;

		if (playercount >21){
			win(false);
		} else{
			if (computercount<15){
				drawcard(computerhand);
				display(computerhand[computerhand.length-1],computershowing);
				computercount += addvalue(computerhand[computerhand.length-1]);
				computervalue.textContent = "Computer Hand - Total:?";
				if (computercount>21){
					win(true);
				}
			}
		}

	});

	//stand
	stand.addEventListener('click',function(evt){
		evt.preventDefault();
		while (computercount<16){
				drawcard(computerhand);
				display(computerhand[computerhand.length-1],computershowing);
				computercount += addvalue(computerhand[computerhand.length-1]);
				computervalue.textContent = "Computer Hand - Total:?";
				if (computercount>21){
					win(true);
				}
		}

		const unknc = document.querySelector(".unknowncard");
		unknc.className = "card";
		unknc.innerHTML = '<div class="num">'+computerhand[0].num+'</div>' +'<div class="shape">'+ computerhand[0].shape+'</div>'

		const finalcomputercount = count(computerhand);
		const finalplayercount = count(playerhand);

		console.log(finalcomputercount);
		console.log(finalplayercount);

		if (finalcomputercount> finalplayercount){
			win(false);
		} else {
			win(true);
		}

	});

	//count who is the winner considering A
	function count(hand){
		let numAce = 0;
		let count = 0
		for (let i = 0;i<hand.length;i++){
			count += addvalue(hand[i]);
			if (hand[i].num === "A"){
				count -= 1;
				numAce += 1;
			}
		}	
		
		if (numAce === 0){
			if (count >21){
				count = -1;
			}
		}

		else if (numAce ===1 ){
			if (count>20){
				count = -1;
			} else if (count>=11 && count <=20){
				count += 1;
			} else {
				count += 11;
			}
		}

		else if (numAce === 2){
			if (count>19){
				count = -1;
			} 
			else if (count <=19 && count >=10) {
				count +=2;
			} else {
				count +=12;
			}
		} 

		else if (numAce === 3){
			if (count >18){
				count =-1;
			} else if (count <=18 && count >=9){
				count +=3;
			} else {
				count += 13;
			}
		}

		else {
			if (count>17){
				count = -1;
			} else if (count <=17 && count >= 8){
				count +=4;
			} else {
				count +=14;
			}
		}
		return count;
	}

	function win(winornot){
		let cgd;
		cgd = document.createElement('div');
		cgd.className = "cgd";

		if(winornot){
			cgd.textContent = "you win";
		} else {
			cgd.textContent = "you lose";
		}

		document.body.appendChild(cgd);
	}
}
