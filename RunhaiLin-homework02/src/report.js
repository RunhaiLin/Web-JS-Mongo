//Runhai Lin
const hf = require('./hoffy.js');
const nba = require('./nba.js');

const extractor = JSON.parse;
const myfilereader = hf.readAndExtractWith(extractor);


const success = function(data) {
	//console.log(data);
	//console.log(typeof data);
	// console.log(data["resultSets"][0]);
	// console.log("===================================================");
	// console.log(data["resultSets"][1]);
	// console.log("===================================================");
	// console.log(data["resultSets"][2]);

	let report = "";


	const ps = data["resultSets"][0];
	const ts = data["resultSets"][1];
	//console.log(ps);

	const teamdata = {"rows":ts["rowSet"],"headers":ts["headers"]};
	//console.log(teamdata);
	const teamdataobj = hf.rowsToObjects(teamdata);
	//console.log(teamdataobj);

	const teamone = teamdataobj[0]["TEAM_CITY"];
	const teamonepts = teamdataobj[0]["PTS"];
	const teamtwo = teamdataobj[1]["TEAM_CITY"];
	const teamtwopts = teamdataobj[1]["PTS"];
	report += "* The score was: { "+teamone+": "+teamonepts+", "+teamtwo+": "+teamtwopts+" }\n";
	//const teamname = nba.getTeamCities(teamdataobj);

	const playerdata = {"rows":ps["rowSet"],"headers":ps["headers"]};
	//console.log(playerdata);
	const playerdataobj = hf.rowsToObjects(playerdata);

	const bestpasser = nba.bestPasser(playerdataobj);
	report += "* The best passer was: "+bestpasser["PLAYER_NAME"]+"with "+bestpasser["AST"]+" assists.\n";

	const teamrebound = nba.reboundTotals(playerdataobj);
	
	report += "* The total rebounds per team were:"+" { "+teamone+": "+teamrebound[teamone]+", "+teamtwo+": "+teamrebound[teamtwo]+" }\n";
	report += "* The best 3-point shooters were:\n";

	const bestFG3 = nba.bestFG3(playerdataobj);	

	report += "1. "+bestFG3[2]["PLAYER_NAME"]+": "+bestFG3[2]["FG3_PCT"]+"\n";
	report += "2. "+bestFG3[1]["PLAYER_NAME"]+": "+bestFG3[1]["FG3_PCT"]+"\n";
	report += "3. "+bestFG3[0]["PLAYER_NAME"]+": "+bestFG3[0]["FG3_PCT"]+"\n";
	console.log(report);
} ; 

const failure = (err) => console.log('Error opening file:', err);

myfilereader(process.argv[2], success, failure); 

//console.log(dataset["resultSets"][0]);
