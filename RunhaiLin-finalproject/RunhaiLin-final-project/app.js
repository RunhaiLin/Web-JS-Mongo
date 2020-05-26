const db = require('./db');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'This is the secret you want to seek',
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

//use bcrypt to deal with password

const bcrypt = require('bcrypt');
const saltRounds = 10;


// start
const user = mongoose.model('user');
const monster = mongoose.model('monster');
const team = mongoose.model('team');


// setting local variables
app.use(function(req, res, next){
	res.locals.username = req.session.username;
	next();
});

// error handling
app.use(function(err,req,res,next){
	res.status(500);
	res.render("error",{error:err});	
});


// log in page
app.get('/', (req, res) => {
  res.render('login'); 
});

// user can either log in by password or log in as guest
app.post('/',(req,res)=>{
		const login_username = req.body.loginusn;
		const login_password = req.body.loginpsw;
		user.find({username:login_username},(err,founduser) =>{
			if (err){
				console.log(err);
				
			} else {
	
				if (founduser.length === 0){
					//interaction will be turned out to be an alert box in the future
					console.log("User not found");
					res.redirect('/');
				}
	
				else {
					console.log(founduser);
					bcrypt.compare(login_password,founduser[0].hash,(err,same)=>{
						if (err){
							console.log(err);
							
						} else{
							if (same){
								req.session.username = founduser[0].username;
								res.redirect('/home');
							}
							else{
								//interaction will be turned out to be an alert box in the future
								console.log("password incorrect");
								res.redirect('/');
							}
						}
					})
				}
				
			}
	
	
		});
	

	
});

// user can register here
app.get('/newaccount',(req,res)=>{
	res.render('newaccount');
});

app.post('/newaccount',(req,res)=>{
	const newusn = req.body.newusn;
	

	const newpwd = req.body.newpwd;

	//console.log(newusn);
	//console.log(newpwd);
	//check whether this new user name and password is valid
	if (newpwd.length <=4){
		//interaction will be turned out to be an alert box in the future
		console.log("Password too short");
		res.redirect('/');
	}
	else{
		user.find({username:newusn},(err,founduser)=>{
			if (err){
				console.log(err);
				
			}

			else{
				if (founduser.length != 0){
					//interaction will be turned out to be an alert box in the future
					console.log("Username already exists");
					res.redirect('/');
				}
				else{
						bcrypt.genSalt(saltRounds, function(err, salt) {
						if (err){
							console.log(err);
							
						}
						else{
							//console.log(salt);

							bcrypt.hash(newpwd, salt, function(err, hash){


								//console.log(hash);

								if (err){
									console.log(err);
									
									}
						    	const newuser = new user({
						  		username:newusn,
						  		salt:salt,
						  		hash:hash,
						  		ismanager:false,
						  		user_monsters:[],
						  		user_teams:[],
								});
						        
						        newuser.save((err,saveduser)=>{
								if (err) {
									console.log(err);
									
								}
								else{
									console.log("A new user has registered.")
									console.log(saveduser);
									res.redirect('/');
										}
									});
						    	});
						}
					});
				}
			}
	});

	}


});



// the main page for user to check the information of monsters

app.get('/home',(req,res)=>{
	
	if (req.session.username){
		//if the user has logged in
		const contextcontent = {}
		monster.find((err,foundmonster)=>{
			if (err){
				console.log(err);
				
			} else{
				let result = foundmonster;
				if (req.query.hasOwnProperty('monstersearch')){
					result = foundmonster.filter((ele)=>{
						if( ele.monstername.includes(req.query.monstersearch)){
							return true;
						};
					});
				}

				
				contextcontent['monsterarr'] = result;
				res.render('home-user',contextcontent);
			}
		});	

	}
	else{
		//if not, surf as guest
		//not done
		const contextcontent = {}
		monster.find((err,foundmonster)=>{
			if (err){
				console.log(err);
				
			} else{
				let result = foundmonster;
				if (req.query.hasOwnProperty('monstersearch')){
					result = result.filter((ele)=>{
						if( ele.monstername.includes(req.query.monstersearch)){
							return true;
						};
					});
				}

				if (req.query.hasOwnProperty('typesearch')){
					result = result.filter((ele)=>{
						if( ele.type.includes(req.query.typesearch)){
							return true;
						};
					});
				}
				
				contextcontent['monsterarr'] = result;
				res.render('home-guest',contextcontent);
			}
		});	
	
	}
});

// page for users to see their monsters

app.get('/mymonster',(req,res)=>{
	if (req.session.username){
		const contextcontent = {};
		let result = [];
		user.find({username:req.session.username},(err,founduser)=>{
			if (err){
				console.log(err);
				
			} else{
				const founderum = founduser[0].user_monsters;

				console.log(founderum);

				function getmonsterinfo(arr,n,donedowhat){
					if (n<founderum.length){
						monster.findById(founderum[n],(err,foundedmonster)=>{
							if (err){
								console.log(err);
								
							}
							//console.log(foundedmonster);
							arr.push(foundedmonster);
							getmonsterinfo(arr,n+1,donedowhat);
						});
					} else{
						donedowhat(arr);
					}
				}

				function done(arr){
					contextcontent['monsterarr'] = arr;

					console.log(contextcontent);

					res.render('mymonster',contextcontent);
				}

				getmonsterinfo(result,0,done);
			}
		})
	} else{
		res.render('guest');
	}
})

// page for user to add monsters into their collection

app.get('/addmymonster',(req,res)=>{
	if (req.session.username){
		const contextcontent = {};
		let result;
		monster.find((err,foundmonster)=>{
			if (err){
				console.log(err);
				
			} else{
				result = foundmonster;
				contextcontent['monsterarr'] = result;

				res.render('addmymonster',contextcontent);
			}
		})
	} else{
		res.render('guest');
	}
});

app.post('/addmymonster',(req,res)=>{

	// console.log(req.body);
	if (req.session.username){
		
		user.find({username:req.session.username},(err,founduser)=>{
			//console.log(founduser[0]);
			let new_user_monsters = founduser[0].user_monsters;
			//console.log(new_user_monsters);
			//console.log(req.body.monstercheckbox);

			const new_input_monsters = [].concat(req.body.monstercheckbox);
			new_input_monsters.forEach(
				(ele)=>{
					if (! new_user_monsters.includes(ele)){
						new_user_monsters.push(ele);
					}
				}
			)
			
			//console.log(new_user_monsters)

			user.updateOne({username:req.session.username},{$set: {user_monsters : new_user_monsters}},(err,saveduser)=>{
				if (err){
					console.log(err);
					
				} else{
					console.log("An User change his monster information");
					//console.log(saveduser);
					res.redirect('/mymonster');
				}
			} );
			
		})
		
	} else{
		res.redirect('/');
	}
	
})

// page for user to look up their teams

app.get('/myteam',(req,res)=>{
	if (req.session.username){

		user.find({username:req.session.username},(err,founduser)=>{
			if(err){
				console.log(err);
			} else{
				const founduserarr = founduser[0].user_teams;
				//console.log(founduserarr);
				display(founduserarr);

			}
			
		});

		function display(input){
			//console.log("input",input);
			let teamarr = []
			function display_1nd_step (n){
				if (n<input.length){
					team.findById(input[n],(err,foundteam)=>{
						if (err){
							console.log(err);
						}
						else{
							//console.log("foundteam",foundteam);
							teamarr.push(foundteam);
							display_1nd_step(n+1);
						}
					})
				} else{
					//console.log(teamarr);
					display_2nd_step(teamarr);
				}
			}
			display_1nd_step(0);
		}

		function display_2nd_step(input){
			
			let teamobjarr =[];


			function display_2_ing(n){

				if (n<input.length){
					const teamobj = {
						teamname:input[n].teamname,
						monsters:[]
					}

					function teamobjwork(i){
						if (i<6){
							const monsterid = input[n].monsters[i];
							monster.findById(monsterid,(err,foundmonster)=>{
								if (err){
									console.log(err);
								} else{
									teamobj.monsters.push(foundmonster);
									teamobjwork(i+1);
								}
							})
						} else{
							teamobjarr.push(teamobj);
							display_2_ing(n+1);
						}
					}

					teamobjwork(0);
				} else{
					//console.log("teamobjarr",teamobjarr);
					display_3rd_step(teamobjarr);
				}
			}
			display_2_ing(0);

		}

		function display_3rd_step(input){
			const contextcontent = {
				teamarr:input
			}

			res.render('myteam',contextcontent);
		}
		

	} else{
		res.render('guest');
	}
});

// page for user to add a team

app.get('/addmyteam',(req,res) =>{
	if (req.session.username){
		const contextcontent = {};
		let result;
		monster.find((err,foundmonster)=>{
			if (err){
				console.log(err);
				
			} else{
				result = foundmonster;
				contextcontent['monsterarr'] = result;

				res.render('addmyteam',contextcontent);
			}
		})
	} else{
		res.render('guest');
	}
});

app.post('/addmyteam',(req,res)=>{
	if (req.session.username){
		const teamname = req.body.teamname;
		const teamcheckbox = req.body.teamcheckbox;
		
		user.find({username:req.session.username},(err,founduser)=>{
			if (err){
				console.log(err);
				
			} else{
			
				const foundid = founduser[0]._id;
				const teamobj = new team({
					user: foundid,
					teamname:teamname,
					monsters:teamcheckbox
				
				})
				
				teamobj.save((err,savedteam)=>{
					if (err){
						console.log(err);
						
					} else{
						console.log("A new team saved");
						console.log(savedteam);

						const new_team_arr = founduser[0].user_teams;
						new_team_arr.push(savedteam._id);
						
						user.updateOne({username:req.session.username},{$set: {user_teams : new_team_arr}},(err,data)=>{
							if (err){
								console.log(err);
								next(err)
							} else{
								console.log("An User change his team information");
								//console.log(saveduser);
								res.redirect('/myteam');
							}

						})

						
					}
				})
			}
		})
	
	} else{
		res.render('guest');
	}
	
});

app.listen(3000);