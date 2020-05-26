//Runhai Lin

//the set up code from class 10
const express = require('express');
const path = require('path');
const app = express();
const ts =  require('./transaction.js');

//importing data




const f = function (transactionBlockArr){
	// order the arr

	// let transactionobj = {};
	// transactionBlockArr.forEach((element) =>{
	// 	let elementname = element["name"];
	// 	transactionobj[elementname] = element;
	// })


	let newarr = [];
	let i = 0;
	while (true){
		if (transactionBlockArr[i]["prev"] != undefined ){
			i++;
		} else {
			newarr[0] = transactionBlockArr[i];
			break;
		}
	}


	let prevname = newarr[0]["name"];
	while (newarr.length<transactionBlockArr.length){
		let j = 0;
		while (true){
			if (transactionBlockArr[j]["prev"] === prevname){
				newarr.push(transactionBlockArr[j]);
				prevname = transactionBlockArr[j]["name"];

				break;

			} else {
				j++;
			}
		}
	}


	//console.log(newarr);
	newarr[0]["prev"] = "None";

	const reversenewarr = newarr.reverse();
	app.use(express.urlencoded({extended:false}));
	const publicpath = path.join(path.dirname(__filename),'public');


	app.use(express.static(publicpath));


	app.set('view engine','hbs');



	app.get("/",(req,res)=>{
		const contextObj = {tb:reversenewarr};
		res.render('all',contextObj);

	});

	app.get("/latest/block",(req,res)=>{
		const contextObj = {b:newarr[0]};
		res.render('latest-block',contextObj);

	})

	app.get("/latest/tx",(req,res)=>{

		const contextObj = {b:newarr.reduce(
			(accumulator,currentValue) =>{
				for (let q = 0;q<currentValue["transaction"].length;q++){					
					if (currentValue["transaction"][q]["timestamp"]>accumulator["timestamp"]){
						accumulator = currentValue["transaction"][q];
					}
					
				}
				return accumulator;

			}

			,newarr[0]["transaction"][0])};

		//console.log(contextObj);
		res.render('latest-txt',contextObj);

	})


	app.get("/random",(req,res)=>{
		const ran1 = Math.floor(Math.random() * Math.floor(newarr.length));
		const ran2 = Math.floor(Math.random() * Math.floor(newarr[ran1]["transaction"].length));


		//console.log(newarr[ran1]["transaction"][ran2]);
		const contextObj = {b:newarr[ran1]["transaction"][ran2]};
		res.render('random',contextObj);

	})

	app.listen(3000);
	console.log("server started; type CTRL+C to shut down");
}

ts.loadAllTransactions('transactions',f);

