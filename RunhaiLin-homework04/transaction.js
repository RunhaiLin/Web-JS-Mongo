const fs = require('fs');
const path = require('path');

class transactionBlock{
	constructor(name,prev,transaction){
		this.name = name;
		this.prev = prev;
		this.transaction = transaction;
	}

}


const loadfiles=  function(dirname,files,donetowhat,transactionBlockArr){
	

	if (files.length === 0 ){
		
		donetowhat(transactionBlockArr);
		return;
	} else {
		
		let filename = files.pop();
		
		if (path.extname(filename) != ".json"){
			return loadfiles(dirname,files,donetowhat,transactionBlockArr);
		} 
		else {
			fs.readFile(dirname+"/"+filename,(err,data)=>{
				if (err){
					console.log("Can not read this file:"+filename+"\n");
					return loadfiles(dirname,files,donetowhat,transactionBlockArr);
				} else {

					const obj = JSON.parse(data);
					const tsbname = filename.split('.')[0];
					const tsbprev = obj["previous"];
					const tsbtransaction = obj["transactions"];
					const tsb = new transactionBlock(tsbname,tsbprev,tsbtransaction);
					transactionBlockArr.push(tsb);
					return loadfiles(dirname,files,donetowhat,transactionBlockArr);
				}
			})

		}

		}
	}



const loadAllTransactions = function(dirname,donetowhat)
{	
	let transactionBlockArr = [];
	fs.readdir(dirname,function(err,files){
		if (err){
			console.log("Can not read this directory!");
			return;
		} else{
			console.log("Successfully read the directory");

			 return loadfiles(dirname,files,donetowhat,transactionBlockArr);
		}	
	})
}



module.exports = {
	loadAllTransactions:loadAllTransactions
}