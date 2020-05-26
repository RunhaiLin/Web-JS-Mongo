// app.js
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const db = require('./db.js');
const app = express();
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

const session = require('express-session');
const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};
app.use(session(sessionOptions));

const review = mongoose.model("review");

app.use(function(req, res, next){
	res.locals.count = req.session.count;
	next();
});

app.get('/', (req, res) => {
  let semester = "";
  let year = "";
  let prof = "";

  	if (req.session.count){
  		req.session.count+=1;
  	}
  	else{
  		req.session.count = 1;
  	}

  if (req.query.hasOwnProperty('semester')){
  	semester = req.query.semester;
  }
  if (req.query.hasOwnProperty('year')){
  	year = req.query.year;
  }
  if (req.query.hasOwnProperty('prof')){
  	prof = req.query.prof;
  }

  //console.log(semester == "");
  //console.log(year == "");
  //console.log(prof == "");


  review.find({}, (err, result) => {
  	result = result.filter((ele) =>{
  		return (semester == "" || ele.semester === semester) && 
  		(year == "" || ele.year === +year) && 
  		(prof == "" || ele.professor === prof);
  	}


  	)

    res.render('review', {'review': result});


});
});

app.get('/reviews/add',(req,res) =>{
	if (req.session.count){
  		req.session.count+=1;
  	}
  	else{
  		req.session.count = 1;
  	}
	res.render('add');

});

app.post('/reviews/add',(req,res)=>{
	const coursenumber = req.body.coursenumber;
	const coursename = req.body.coursename;
	const semester = req.body.semester;
	const year = req.body.year;
	const professor = req.body.prof;
	const inreview = req.body.review;

	const newreview = new review({
  		courseNumber: coursenumber,
  		courseName: coursename,
  		semester: semester,
  		year: +year,
  		professor: professor,
  		review:inreview		
	});

	if (req.session.myreview){
		req.session.myreview.push(newreview);
	} else{
		req.session.myreview = [];
		req.session.myreview.push(newreview);
	}

	//console.log(req.session.myreview);

	newreview.save((err,savedrv)=>
	{
		if (err){
			console.log(err);
		} else{
			//console.log(savedrv);
			res.redirect('/');
		}
	})
	
})

app.get('/reviews/mine',(req,res) =>{
	if (req.session.count){
  		req.session.count+=1;
  	}
  	else{
  		req.session.count = 1;
  	}

  	let myreviewobj = {};

  	if (req.session.myreview){
  		myreviewobj.mr = req.session.myreview;
  	} 



	res.render("mine",myreviewobj);
})


app.listen(3000);