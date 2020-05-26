const net = require('net');
const path = require('path');
const fs = require('fs');

//server part

//copy the request class from web.js
class Request {
  constructor(s) {
    const [method, path, version, ...parts] = s.split(' ');
    Object.assign(this, {method, path, version});
  }
}

//const req = new Request("GET / HTTP/1.1")
//console.log(req);

//copy the response class from web.js
class Response{
	static sep = '\r\n';
	static statusCodeMap = {
    	200: 'OK', 
    	404: 'Not Found',
    	500: 'Internal Server Error'
  };

 	constructor(sock) {
    	this.sock = sock; 
    	this.statusCode = undefined;  
    	this.headers = {};
   } 

   set(headerName, value) {
    	this.headers[headerName] = value; 
   }

  setStatusCode(statusCode){
  		this.statusCode = statusCode;
  }

  send(body) {
	    const statusLine = `HTTP/1.1 ${this.statusCode} ${Response.statusCodeMap[this.statusCode]}`;
	    const headerString = Object.entries(this.headers)
	      .map(arr => `${arr[0]}: ${arr[1]}`)
	      .join(Response.sep);
	    this.sock.write(statusLine + Response.sep);
	    this.sock.write(headerString + Response.sep + Response.sep);
	    this.sock.write(body);
	    this.sock.end();
  }
}

//my server
//copy the App class from web.js
//but use filesystem as tool
class App {
  constructor(RootDirectory) {
  	this.RootDirectory = RootDirectory;
    this.server = net.createServer(sock => {
      console.log('Client connected!');
      sock.on('data', (msg) => this.handleIncomingMessage(sock, msg));
    });
  }

  handleIncomingMessage(sock, msg) {
    const req = new Request(msg + '');
    const res = new Response(sock);

    const RD = this.RootDirectory;
    
    console.log(req.method, req.path);

    //check if there is ".." in the path of request
    if (req.path.includes("..") ){
      res.setStatusCode(404);
      res.set('Content-Type', 'text/plain');
      res.send("You can not go up!");
      return;
    }

   	fs.access(RD+req.path, function(err) {
    if (err) {
    	res.setStatusCode(404);
    	res.set('Content-Type', 'text/plain');
      res.send("We can't find this page!");
    	return;
    	}
  		
  		fs.lstat(RD+req.path,function(err,stat){
			if (err){
				res.setStatusCode(500);
    		res.set('Content-Type', 'text/plain');
      	res.send("Error from lstat!");
    		return;
			}
			else{
				//if it is a file
				if (stat.isFile()){

          //check the type of extension
          res.setStatusCode(200);
          const extensionlist = req.path.split('.');
          const extension = extensionlist[extensionlist.length-1];


					const f =fs.readFile(RD+req.path,function(err,data){
						if (err){
							res.setStatusCode(500);
    						res.set('Content-Type', 'text/plain');
      						res.send("Error from readFile!");
    						return;
						}

						else{
							if (extension === 'html'){	
								res.set('Content-Type', 'text/html');	
							} 
              if (extension === 'css'){
                res.set('Content-Type', 'text/html');
              } 
              if (extension === 'txt'){
                res.set('Content-Type', 'text/plain');
              }
              if (extension === 'jpeg' || extension === 'jpg'){
                res.set('Content-Type', 'image/jpeg');
              } 
              if (extension === 'png'){
                res.set('Content-Type', 'image/png');
              }
              if (extension === 'gif'){
                res.set('Content-Type', 'image/gif');
              }
              res.send(data);
						}
					})
				}
				
				//if it is a dir
        if (stat.isDirectory()){
            const d = fs.readdir(RD+req.path,{withFileTypes: true},function(err,files){
            if (err){
              res.setStatusCode(500);
              res.set('Content-Type', 'text/plain');
              res.send("Error from readdir!");
              return;
            }
            else{
              //hide the hidden files
              res.setStatusCode(200);
              res.set('Content-Type', 'text/html');
              const newfiles = files.filter(fl => fl["name"][0] != '.');
              let body = "<html>";


              newfiles.forEach((fl)=>{

                //check whether is directory
                let filenamewithstr =fl["name"];
                if (fl.isDirectory()){
                  filenamewithstr += "/";
                  
                }


                body+= "<a href="+filenamewithstr+"> "+fl["name"]+"</a><br>";

              })
              body +="</html>";
              res.send(body);

            }
          })
        }
				
			}
		});
	});
 
   }

  listen() {
    this.server.listen(3000, '127.0.0.1');
  }
}

module.exports = {App:App};
