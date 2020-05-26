// Runhai Lin
// 2nd DRAFT DATA MODEL

//There would be huge changes later 2.0


const mongoose = require('mongoose');

// Users
// * our site requires authentication...
// * so users have a username and password
// * they have a list of monster they collect
const UserSchema = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  username: {type:String,require:true},
  hash:{type:String,require:true},
  salt:{type:String,require:true},

  ismanager:{type:Boolean,default:false},

  user_monsters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Monsters'}],
  user_teams:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

mongoose.model('user',UserSchema);



// Monsters
// * the information of a certain monster

const MonstersSchema = new mongoose.Schema({

  //ObjectId: 
  monstername:{type:String,require:true},
  img : {type:String,require:false},
  type : {type:String,require:true},

});


mongoose.model('monster',MonstersSchema);

// Team
// * a Team is a  list of 6 monsters
// * a Team must have its related user
const TeamSchema = new mongoose.Schema({
  //ObjectId:
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  teamname:  String,
  monsters: [{type: mongoose.Schema.Types.ObjectId, ref: 'Monsters'}],


})


mongoose.model('team',TeamSchema);


mongoose.connect('mongodb://localhost/finalproject',{useNewUrlParser: true, useUnifiedTopology: true});
