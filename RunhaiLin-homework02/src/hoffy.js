// hoffy.js
//Runhai Lin

function sum( ... numn){
	if (numn.length ===0){
		return 0;
	}
	else {
		const i = numn[0];
		numn = numn.slice(1);
		return i+sum(...numn);
	}

}

function callFn(fn,n,arg){
	if (n>0){
		fn(arg);
		callFn(fn,n-1,arg);
	}else{
		return;
	}

}

function betterCallFn(fn, n, ... argsn){
	if (n>0){
		fn(...argsn);
		betterCallFn(fn,n-1,...argsn);
	} else{
		return;
	}
}

function opposite(oldFn){
	function newfn(...args){
		return !oldFn(...args);
	}

	return newfn;
}

function bucket(arr,fn){
	const oppoFn = opposite(fn);
	const returnarr = [];
	returnarr.push(arr.filter(fn));
	returnarr.push(arr.filter(oppoFn));
	return returnarr;
}

function addPermissions(oldFn)
{
	function newfn(permission,...arg){
		if ( typeof permission === "undefined" || permission ===null){
			return;
		}

		else if (Object.prototype.hasOwnProperty.call(permission, "admin") && permission["admin"] === true){
			return oldFn(...arg);
		}
		else{
			return;
		}
	}
	return newfn;

}

function myReadFile(fileName, successFn, errorFn){
	const fs = require('fs');
	fs.readFile(fileName, 'utf-8', function(err,data){
		if (err){
			errorFn(err);
		}
		else{
			successFn(data);
		}
	});
}

function readAndExtractWith(extractor){

	function fn(fileName,successFn,errorFn){
		const fs = require('fs');
		fs.readFile(fileName, 'utf-8', function(err,data){
			if (err){
				errorFn(err);
			}
			else{
				const dataobj = extractor(data);
				successFn(dataobj);
		
			}
		});
		}
	return fn;
}

function rowsToObjects(data){
	const rows = data["rows"];
	const headers = data["headers"];
	
	const reducerinrow = function(acc,cur,ind){

		acc[headers[ind]] = cur;
		return acc;
	};
	const reducer = function(accumulator,currentValue) {
		//accumulator is an array of class {}
		//currentValue is an array of the a row
		const inf = currentValue.reduce(reducerinrow,{});
		accumulator.push(inf);
		return accumulator;
	};
	
	return rows.reduce(reducer,[]);
}



module.exports = {
    sum:sum,
    callFn:callFn,
    betterCallFn:betterCallFn,
    opposite:opposite,
    bucket:bucket,
    addPermissions:addPermissions,
    myReadFile:myReadFile,
    readAndExtractWith:readAndExtractWith,
    rowsToObjects:rowsToObjects


};
