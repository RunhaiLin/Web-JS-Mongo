const fs = require('fs');
const path = require('path');
const RootDirectory = process.argv[2];
const RootAbsolute = path.join(path.dirname(__filename),process.argv[2]) ;
// fs.lstat(RootDirectory,function(err,stat){
// 	if (err){
// 		console.log("Can't find this file");
// 	}
// 	else{
// 		console.log(stat);
// 		console.log(stat.isDirectory());
// 		console.log(stat.isFile());
// 	}
// });


// fs.readFile(RootDirectory+"/css/base.css",'utf8',function(err,data){
// 	if (err){
// 		return console.log("Error");
// 	}
// 	else{
// 		console.log(data);
// 	}
// })



fs.readdir(RootDirectory,{withFileTypes: true},function(err,files){
	if (err){
		console.log("Directory not found");
	} else{
		console.log(files[0].isDirectory());
	}
});

