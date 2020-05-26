const mongoose = require('mongoose');

const reviewSchema  =  new mongoose.Schema({
	courseNumber: {type:String, require:true},
	courseName: {type: String, require:true},
	semester: {type:String, require:true}, 
	year:{type:Number, require:true}, 
	professor: {type:String, require:true}, 
	review: {type:String, default:"The answer is always undefined" }
});

mongoose.model('review',reviewSchema);


// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, '../config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/YOUR_DATABASE_NAME_HERE';
}

console.log(dbconf);
mongoose.connect(dbconf,{useNewUrlParser: true, useUnifiedTopology: true});
