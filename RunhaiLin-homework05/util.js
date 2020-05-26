const fs = require('fs');

class Image {
  constructor(url, tags) {
    this.url = url;
    this.tags = tags
  }
}

function loadData(filePath, allData, cb) {
  fs.readFile(filePath, (err, jsonData) => {
    if(!err) {
      const data = JSON.parse(jsonData);
      data.images.forEach(image => {
        allData.push(new Image(image.url, image.name.split('-')));
      });
      cb();
    } else {
      console.log('could not read', filePath);
      console.log(err);
    }
  });
}

module.exports = {
  Image: Image,
  loadData: loadData,
};