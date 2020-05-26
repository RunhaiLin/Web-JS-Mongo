// nba.js
//Runhai Lin





// data = [ 
//   {"TEAM_CITY": "Brooklyn", "PLAYER_NAME": "Spencer Dinwiddie", "FG3_PCT": 0.25,"AST":10,"REB":8}, // more properties included
//   {"TEAM_CITY": "Brooklyn", "PLAYER_NAME": "Joe Harris", "FG3_PCT": 0.75,"AST":11,"REB":9}, // more properties
//   {"TEAM_CITY": "Atlanta", "PLAYER_NAME": "Trae Young", "FG3_PCT": 0.67,"AST":12,"REB":10} // more properties
//   // more object after this
// ];



function bestPasser(data){
	const reducer = function(accumulator,currentValue){

		

		if (currentValue["AST"] > accumulator["AST"]){
			return currentValue;
		} else{
			return accumulator;
		}
	};

	return data.reduce(reducer);

}

function getTeamCities(data){

	const mapping = function(x){
		return x["TEAM_CITY"];		
	};
	const city = data.map(mapping);
	const f = function(element,index,array){
		return array.indexOf(element) === index;
	};
	const filtercity = city.filter(f);
	return filtercity;	
}


function teamRebounds(city, data){
	const cityfil = function(element){
		return element["TEAM_CITY"] === city;
	};
	const playerIn = data.filter(cityfil);


	const reboundreducer = function(totalrebound, currentplayer){
		totalrebound += currentplayer["REB"];
		return totalrebound;
	};
	return playerIn.reduce(reboundreducer,0);

}

function reboundTotals(data){
	const city = getTeamCities(data);

	const reducer = function(acc,city){
		acc[city] = teamRebounds(city,data);
		return acc;
	};
	const cityrebound = city.reduce(reducer,{});
	return cityrebound;

}


function bestFG3(data){
	const compare = function(a,b){
		if(a["FG3_PCT"]>b["FG3_PCT"]){
			return 1;
		}else if (a["FG3_PCT"]==b["FG3_PCT"]){
			return 0;
		}else{
			return -1;
		}
	}
	const reducer = function(accumulator,currentValue){

		if (currentValue["FG3A"]<=1){
			return accumulator;
		} 
		else if (accumulator.length<3){
			accumulator.push(currentValue);
			accumulator.sort(compare);
			return accumulator;
		} 
		else if (accumulator[0]["FG3_PCT"]<currentValue["FG3_PCT"]){
			accumulator[0] = currentValue;
			accumulator.sort(compare);
			return accumulator;
		} else{
			accumulator.sort(compare);
			return accumulator;
		}
	};

	return data.reduce(reducer,[]);
}

module.exports = {
	bestPasser:bestPasser,
	getTeamCities:getTeamCities,
	teamRebounds:teamRebounds,
	reboundTotals:reboundTotals,
	bestFG3:bestFG3

};