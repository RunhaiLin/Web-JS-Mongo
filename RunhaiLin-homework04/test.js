const express = require('express');
const path = require('path');
const app = express();
app.use(express.urlencoded({extended:false}));


const publicpath = path.join(path.dirname(__filename),'public');
console.log(publicpath);
app.use(express.static(publicpath));


// app.set('view engine', 'hbs');

// app.get('/', function(req, res){
// 	res.render('layout',{});
// });




app.listen(3000);
console.log('Started server on port 3000');