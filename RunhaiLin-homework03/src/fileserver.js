const path = require('path');
const fs = require('fs');
const myserver = require('./myserver.js');

//fs part

const RootAbsolute = path.join(path.dirname(__filename),process.argv[2]) ;


const filehandling= function(err,files){
	if (err){
		console.log("Directory not found");
	} else{
		//files is an array
		const app =new myserver.App(RootAbsolute);
		app.listen();
	}
};

const f = fs.readdir(RootAbsolute, filehandling);

