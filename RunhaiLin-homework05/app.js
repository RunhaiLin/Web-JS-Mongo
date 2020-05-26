const express = require('express');
const path = require('path');
const app = express();
const { loadData, Image } = require('./util');

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

const images = [];

//
// displays all images
//
app.get('/', function(req, res) {
	let results = images;
  if (req.query.hasOwnProperty('tagQuery')){
  	const tagQueryArr = req.query.tagQuery.split(',');
  	results = images.filter(ele =>{
  		for (let i = 0;i<tagQueryArr.length;i++){
  			if (ele['tags'].includes(tagQueryArr[i])){
  				return true;
  			};
  		}
  		
  	});
  }

  
  res.render('home', { images: results });
});

const dataPath = path.join(__dirname, 'data.json');

loadData(dataPath, images, () => {
  console.log(images);
  console.log(`loaded ${images.length} images`);

  const port = 3000;
  app.listen(port);

  console.log(`server started on port ${port}`);
});

app.get('/add',function(req,res){
	res.render('add');
});


app.post('/add',function(req,res){
	const url = req.body.URL;
	const tagsarr = req.body.tags.split(',');
	images.unshift({'url':url,'tags':tagsarr});
	res.redirect('/');
})