const db = require('./db');
const mongoose = require('mongoose');
const monster = mongoose.model('monster');
const fs = require('fs');

let monster_arr = [];
let type_arr  = [];
let monster_obj = [];
//first part
fs.readFile("./data.json","utf8",(err,data)=>{

	if(err){
		console.log(err);
	} else{
		const obj = JSON.parse(data);
		monster_arr = monster_arr.concat(obj["monster_arr"]);
		type_arr = type_arr.concat ( obj["type_arr"]);
		// console.log(monster_arr);
		// console.log(type_arr);
		// console.log(monster_arr.length);
		// console.log(type_arr.length);
				
		for (let i = 0;i<monster_arr.length;i++){
			const newmonster = new monster({
				monstername:monster_arr[i],
				img:'./img/'+monster_arr[i]+'.png',
				type:type_arr[i]

			});
			monster_obj.push(newmonster);
		}

		console.log(monster_obj);

		let newmonster_obj = monster_obj;

		function savemonster(i,arr){
			if (i>=arr.length){
				return;
			}
			else{
				const newmonster = arr[i];
				newmonster.save((err,savedmonster) =>{
					if (err){
						console.log(err);
					} else{
						console.log(savedmonster);
						i = i+1;
						savemonster(i,arr);
					}
				})
			}
		}

		savemonster(0,newmonster_obj);

		monster.find((err,found)=>{
			if (err){
				console.log(err);
			} else{
				console.log(found);
			}
		})
			}
});






