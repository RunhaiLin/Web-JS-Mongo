const DEFAULT_AIT_PORT = 3000;

// database setup
require('./db');
const mongoose = require('mongoose');

// express
const express = require('express');
const app = express();

// static files
const path = require("path");
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

// body parser
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'hbs');

const Review = mongoose.model('Review');

// const a = new Review({
//   name:"AIT",
//   semester:"Fall",
//   year:"2019",
//   professor:"ALs",
//   review:"Test"

// })

// a.save((err,saved)=>{
//   console.log(saved);
// })

app.get('/api/reviews', function(req, res) {
  // TODO: retrieve all reviews or use filters coming in from req.query
  // send back as JSON list

    Review.find(function(err,foundreview){
      if (err){
        res.status(500);
        res.send(err);
      } else {
        let reviewobjarr = [];
        foundreview.forEach((ele)=>{
          const reviewobj = {};
          reviewobj["semester"] = ele.semester;
          reviewobj["name"] = ele.name;
          reviewobj["year"] = ele.year;
          reviewobj["review"] = ele.review;
          reviewobjarr.push(reviewobj);
        });

        if (req.query.semester !== undefined && req.query.year !== undefined){
          
          reviewobjarr = reviewobjarr.filter((ele)=>{
              if (req.query.year === ele["year"] || req.query.year === ""){
                if (req.query.semester === ele["semester"] || req.query.semester === ""){
                  return true;
                } else{
                  return false;
                }
              } else{
                return false;
              }

          })
        }
        //console.log(reviewobjarr);
        res.json(reviewobjarr);
      }
    })
});

app.post('/api/review/create', (req, res) => {
  // TODO: create new review... if save succeeds, send back JSON
  // representation of saved object

  const newname = req.body.name;
  const newsemester = req.body.semester;
  const newyear = req.body.year;
  const newreview = req.body.review;
  // console.log(newname);
  // console.log(newsemester);
  // console.log(newyear);
  // console.log(newreview);

  
const a = new Review({
  name:newname,
  semester:newsemester,
  year:newyear,
  professor:"",
  review:newreview
})
  a.save((err,saved)=>{
    if (err){
      res.status(500);
      res.send(err);
    } else{

        Review.find(function(err,foundreview){
          if (err){
            res.status(500);
            res.send(err);
          } else {
            let reviewobjarr = [];
            foundreview.forEach((ele)=>{
              const reviewobj = {};
              reviewobj["semester"] = ele.semester;
              reviewobj["name"] = ele.name;
              reviewobj["year"] = ele.year;
              reviewobj["review"] = ele.review;
              reviewobjarr.push(reviewobj);
            });
            res.json(reviewobjarr);
          }
        });

         
    }
  })
  
});

app.listen(process.env.PORT || DEFAULT_AIT_PORT, (err) => {
  console.log('Server started (ctrl + c to shut down)');
});
