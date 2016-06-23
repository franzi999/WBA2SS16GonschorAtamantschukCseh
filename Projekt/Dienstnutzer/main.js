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

app.get('/search', function(req, res){
	res.render('search.ejs');
    console.log('Suche');
});

app.get('/newfahrt', function(req, res){
	res.render('newfahrt.ejs');
    console.log('New Fahrt');
});

app.get('/usverwaltung', function(req, res){
	res.render('usverwaltung.ejs');
    console.log('In Userverwaltung');
});

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

		//Userverwaltung(User Daten, angebotene Fahrten angucken/ändern/löschen)
		app.get('/userdata', jsonParser, function (req, res) {
		    fs.readFile('./views/userdata.ejs', {encoding: 'utf-8'}, function(err, filestring){

					var user = [];
					var userFahrten = [];
					var nores="";

					if (err){
		        throw err;
		      } else {
		          var useroptions = {
		            host: 'localhost',
		            port: '3000',
		            path: '/users/'+req.query.id,
		            method: 'GET'
		          }

						var fahrtoptions = {
							host: 'localhost',
							port: '3000',
							path: '/fahrten',
							method: 'GET'
						}
					}
					console.log(req.query.id);

		          var externalRequestOne = http.request(useroptions, function(externalResponse){
		            console.log('UserDate Holen');
		            externalResponse.on('data', function(chunk) {

		              var user = JSON.parse(chunk);
									console.log(user);
								});
							});

							var externalRequestTwo = http.request(fahrtoptions, function(externalResponse){
		            console.log('UserFahrten Holen');
		            externalResponse.on('data', function(chunk) {

		              var fahrten = JSON.parse(chunk);
									var userFahrten = [];

									fahrten.forEach(function(fahrt){

										if(fahrt.u_id == req.query.id){
											userFahrten.push(fahrt);
											console.log(fahrt);
										}
									});
									console.log();
									console.log(userFahrten);

									if (Object.keys(userFahrten).length == 0) {
									    console.log('nores wird ausgegeben');
											nores="Keine Fahrten"
									}

		              var html = ejs.render(filestring, {"user":user , userFahrten:userFahrten, nores:nores});
		              res.setHeader('content-type', 'text/html');
		              res.writeHead(200);
		              res.write(html);
		              res.end();
								});
							});

		          externalRequestOne.end();
							externalRequestTwo.end();
		      });
		    });

		//Fahrten beliebig sortieren
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

				app.put('/user/:id', jsonParser, function (req, res) {
					fs.readFile('./views/user.ejs', {encoding: 'utf-8'}, function(err, filestring){

											var user = JSON.stringify(req.body);

					  								if (err){
							  							throw err;
														} else {
										        var options = {
										            host: 'localhost',
										            port: '3000',
										            path: '/users/'+req.params.id,
										            method: 'PUT'
										          }
														}

														var externalRequestTwo = http.request(optionsFahrt, function(externalResponse){
															console.log('New Fahrt added');
															externalResponse.on("data", function(chunk) {
																			console.log("body: " + chunk);

										              var html = ejs.render(filestring, {user:user});
										              res.setHeader('content-type', 'text/html');
										              res.writeHead(200);
										              res.write(html);
										              res.end();
										            });
										          });
															externalRequest.write(user);
															externalRequest.end();
										      });
										    });




    app.listen(serverPort, function(){
      console.log("Server gestartet");
    });
