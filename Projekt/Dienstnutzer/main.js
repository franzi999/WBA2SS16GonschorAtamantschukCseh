var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var ejs = require('ejs');
var fs = require('fs');
var http = require('http');

var app = express();
var serverPort = 3001;

app.use(bodyParser.json());
app.use(express.static(__dirname+ '/public'));


app.get('/', function(req, res){
	res.render('index.ejs');
    console.log('Startseite');
});

//Fahrten beliebig sortieren
app.get('/user/:id', jsonParser, function (req, res) {
    fs.readFile('./views/user.ejs', {encoding: 'utf-8'}, function(err, filestring){
      if (err){
        throw err;
      } else {
          var options = {
            host: 'localhost',
            port: '3000',
            path: '/users/'+req.params.id,
            method: 'GET'
          }
				}

          var externalRequest = http.request(options, function(externalResponse){
            console.log('User nach Id');
            externalResponse.on('data', function(chunk) {

              var user = JSON.parse(chunk);

              var html = ejs.render(filestring, {user:user});
              res.setHeader('content-type', 'text/html');
              res.writeHead(200);
              res.write(html);
              res.end();
            });
          });
          externalRequest.end();
      });
    });

    app.get('/search/fahrten', jsonParser, function (req, res) {
        fs.readFile('./views/fahrt.ejs', {encoding: 'utf-8'}, function(err, filestring){
          if (err){
            throw err;
          } else {
              var options = {
                host: 'localhost',
                port: '3000',
                path: '/fahrten',
                method: 'GET'
							}
						}

              var externalRequest = http.request(options, function(externalResponse){
                console.log('Suche nach Parametern');
                externalResponse.on('data', function(chunk) {

                  var fahrten = JSON.parse(chunk);
									var fFahrten = [];
									var count=0;
									var n=0;

										for (var key in req.query) {
											if (key =='submit')
														break;
														if(req.query[key]){
															n++;
									    				console.log(key + " -> " + req.query[key]);
															console.log(n);
											}
									}

									fahrten.forEach(function(fahrt){
										if(n==0) {
											fFahrten.push(fahrt);
										}
										else {
										for (var key in req.query){
											if (key =='submit'){
														break;
											}

											if(req.query[key]){
												if(key =='start'){
													if(fahrt.start == req.query[key]){
														count++;
													}
												}
										  else if (key =='ziel') {
														if(fahrt.ziel == req.query[key]){
															count++;
														}

											} else {
														if(fahrt.plaetze >= req.query[key]){
															count++;
												}
											}
										}
									}
										if(count == n){
												fFahrten.push(fahrt);
												count=0;
												}
											}
											count=0;
									});

								if (Object.keys(fFahrten).length == 0) {
											res.render('nores.ejs');
											res.end();
									}else{

									var html = ejs.render(filestring, {fFahrten:fFahrten});
                  res.setHeader('content-type', 'text/html');
                  res.writeHead(200);
                  res.write(html);
                  res.end();
								}
                });
              });
              externalRequest.end();
          });
        });





    app.listen(serverPort, function(){
      console.log("Server gestartet");
    });
