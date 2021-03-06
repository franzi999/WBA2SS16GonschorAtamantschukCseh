var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var ejs = require('ejs');
var fs = require('fs');
var http = require('http');
var nodeMailer = require('nodemailer');

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

app.get('/newuser', function(req, res){
	res.render('newuser.ejs');
    console.log('New User');
});

app.get('/newfahrt/:u_id', function(req, res){
	var u_id=req.params.u_id;
	res.render('newfahrt.ejs', {u_id:u_id});
    console.log('New Fahrt');
});

app.get('/usverwaltung', function(req, res){
	res.render('usverwaltung.ejs');
    console.log('In Userverwaltung');
});



app.get('/users/:id', jsonParser, function (req, res) {
					console.log(req.params);
          var options = {
            host: 'localhost',
            port: '3000',
            path: '/users/'+req.params.id,
            method: 'GET'
          }

          var externalRequest = http.request(options, function(externalResponse){
            console.log('User nach Id');
            externalResponse.on('data', function(chunk) {

              var user = JSON.parse(chunk);
							console.log(user);

              res.json(user);
              res.end();
            });
          });
          externalRequest.end();
      });

		//NUR Formular
		app.get('/putuser/:id', function(req, res){
			var userID = req.params.id;
			console.log(userID);
			res.render('putuser.ejs', {userID:userID});
		    console.log('Formular fur User');
		});

		//Bestimmten user öndern (ok)
		app.put('/users/:id', jsonParser, function (req, res) {
												console.log(req.body);

								        var options = {
								            host: 'localhost',
								            port: '3000',
								            path: '/users/'+req.params.id,
								            method: 'PUT',
														headers: {
            									accept:"application/json"
        										}
								          }

												var externalRequest = http.request(options, function(externalResponse){
													console.log('User put');
													externalResponse.on("data", function(chunk) {
														console.log("body: " + chunk);

														res.send(chunk);
														res.end
														});
												});
												externalRequest.setHeader("content-type", "application/json");
					 							externalRequest.write(JSON.stringify(req.body));
					 							console.log("Userdaten wurden überarbeitet");
					 							externalRequest.end();
			});


                //User erstellen
                app.post("/users", function(req, res){
                                     var user;

                                     var newUser =JSON.stringify(req.body);
                                     console.log(newUser);

                                       var options = {
                                         host: 'localhost',
                                         port: '3000',
                                         path: '/users',
                                         method: 'POST'
                                       }

                                     var externalRequest = http.request(options, function(externalResponse){
                                       console.log('User erstellt');
                                       externalResponse.on("data", function(chunk) {
                                               console.log("body: " + chunk);
                                               user = JSON.parse(chunk);

																							res.json(user);
				 																			res.end();
                                       });
                                     });
																		 externalRequest.setHeader("content-type", "application/json");
 																	 	 externalRequest.write(JSON.stringify(req.body));
 																	 	 externalRequest.end();
                });



	 //User löschen(ok)
	 app.delete('/users/:id', jsonParser, function (req, res) {
								 var message="";

											 var options = {
													 host: 'localhost',
													 port: '3000',
													 path: '/users/'+req.params.id,
													 method: 'DELETE'
												 }

											 var externalRequest = http.request(options, function(externalResponse){
												 console.log('User löschen');
												 externalResponse.on("data", function(chunk) {
																 console.log("body: " + chunk);
																 message=chunk;

																 res.send(message);
														 	   res.end();
													 });
												 });
												 externalRequest.setHeader("content-type", "text/plain");
												 externalRequest.end();
										 });


		//Userverwaltung(User Daten, angebotene Fahrten angucken/ändern/löschen)
		app.get('/users/:id/data', jsonParser, function (req, res) {
		    fs.readFile('./views/userdata.ejs', {encoding: 'utf-8'}, function(err, filestring){

					var user=[];
					var userFahrten = [];
					var nores="";

					if (err){
		        throw err;
		      } else {
		          var useroptions = {
		            host: 'localhost',
		            port: '3000',
		            path: '/users/'+req.params.id,
		            method: 'GET'
		          }
					}

		          var externalRequestOne = http.request(useroptions, function(externalResponse){
		            console.log('UserDate Holen');
		            externalResponse.on('data', function(chunk) {

		              var user = JSON.parse(chunk);
									console.log(user);

									if (Object.keys(user).length == 0) {
										res.render('nores.ejs');
										res.end();
									}else{

										var fahrtoptions = {
											host: 'localhost',
											port: '3000',
											path: '/fahrten',
											method: 'GET'
										}
										var externalRequestTwo = http.request(fahrtoptions, function(externalResponse){
				            console.log('UserFahrten Holen');
				            externalResponse.on('data', function(chunk) {

				              var fahrten = JSON.parse(chunk);
											var userFahrten = [];

											fahrten.forEach(function(fahrt){

												if(fahrt.u_id == req.params.id){
													userFahrten.push(fahrt);
													console.log(fahrt);
												}
											});
											console.log();
											console.log(userFahrten);

											 	if(Object.keys(userFahrten).length == 0) {
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
									externalRequestTwo.end();
									externalRequestOne.end();
								}

							});
					});
					externalRequestOne.end();
		      });
		    });


				app.get('/fahrten/:id', jsonParser, function (req, res) {

				          var options = {
				            host: 'localhost',
				            port: '3000',
				            path: '/fahrten/'+req.params.id,
				            method: 'GET'
				          }

				          var externalRequest = http.request(options, function(externalResponse){
				            console.log('Fahrt nach Id');
				            externalResponse.on('data', function(chunk) {

				              var fahrt = JSON.parse(chunk);
											console.log(fahrt.u_id);

											res.send(fahrt);
				              res.end();
				            });
				          });
				          externalRequest.end();
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
															console.log('n = ' +n);
											}
									}

									fahrten.forEach(function(fahrt){
										if(n==0 && fahrt.plaetze > 0) {
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
															console.log("Count erhöht " + count);
												}
											}
										}
									}
										if(count == n && fahrt.plaetze > 0){
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


//Mehr Infos zuf fahrt hollen(entsprechender user wird angezeigt)
	app.get('/fahrten/:id/data', jsonParser, function (req, res) {
	    fs.readFile('./views/fahrtdata.ejs', {encoding: 'utf-8'}, function(err, filestring){

				    				var fahrt=[];
										var fahrtuid;

				    				if (err){
	                   		throw err;
                    } else {
                        var fahrtoptions = {
	                           host: 'localhost',
	                           port: '3000',
	                           path: '/fahrten/'+req.params.id,
	                           method: 'GET'
	                   }

	               			var externalRequestOne = http.request(fahrtoptions, function(externalResponse){
				                   console.log('Fahrt Data');
	                   			 externalResponse.on('data', function(chunk) {

	                       			fahrt = JSON.parse(chunk);
				            					console.log(fahrt.u_id);
															fahrtuid = fahrt.u_id;
				        					});
				    					});

											var useroptions = {
														host: 'localhost',
														port: '3000',
														path: '/users',
														method: 'GET'
											}
										}

                    	var externalRequestTwo = http.request(useroptions, function(externalResponse){
			            					console.log('UserDate Holen');
			            					externalResponse.on('data', function(chunk) {

                            		var user = JSON.parse(chunk);
																var users;
                            		console.log(fahrt.u_id);

																user.forEach(function(user){
                                		if(fahrt.u_id == user.id){
																				users = user;
																				console.log(users);
																		}
                            		});

	                   						var html = ejs.render(filestring, {fahrt:fahrt, users:users});
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

			app.get('/fahrten', jsonParser, function (req, res) {

								var options = {
									host: 'localhost',
									port: '3000',
									path: '/fahrten',
									method: 'GET'
								}

								var externalRequest = http.request(options, function(externalResponse){
									console.log('Fahrt nach Id');
									externalResponse.on('data', function(chunk) {

										var fahrt = JSON.parse(chunk);
										console.log(fahrt);

										res.json(fahrt);
										res.end();
									});
								});
								externalRequest.setHeader("content-type", "text/plain");
								externalRequest.end();
					});



        //NUR Formular laden
        app.get('/putfahrt/:id', function(req, res){
            var fahrtID = req.params.id;
		      res.render('putfahrt.ejs', {fahrtID:fahrtID});
		          console.log(fahrtID);
		              console.log('Formular fur Fahrt');
		});


    //Bestimmte Fahrt ändern
		app.put('/fahrten/:id', jsonParser, function (req, res) {

									var newFahrt =JSON.stringify(req.body);

								        var options = {
								            host: 'localhost',
								            port: '3000',
								            path: '/fahrten/'+req.params.id,
								            method: 'PUT',
														headers: {
            									accept:"application/json"
        										}
								          }

												var externalRequest = http.request(options, function(externalResponse){
													console.log('Fahrt put');
													externalResponse.on("data", function(chunk) {
														console.log("body: " + chunk);

														res.send(chunk);
														res.end
													});
												});
												externalRequest.setHeader("content-type", "application/json");
					 							externalRequest.write(JSON.stringify(req.body));
					 							console.log("Fahrtdate überarbeitet");
					 							externalRequest.end();
			});

//Fahrt erstellen
app.post("/fahrten", jsonParser, function(req, res){

											 var newFahrt = JSON.stringify(req.body);
											 console.log(newFahrt);

					   							var options = {
                           	host: 'localhost',
                           	port: '3000',
                           	path: '/fahrten',
				           				 	method: "POST"
				        					}

											var externalRequest = http.request(options, function(externalResponse){
                            console.log('Fahrt hinzufügen');
															externalResponse.on("data", function(chunk) {
																	console.log(chunk);
																	var response = JSON.parse(chunk);

																res.json(response)
																res.end();
                            	});
				    						});

												externalRequest.setHeader("content-type", "application/json");
      									externalRequest.write(JSON.stringify(req.body));
			     							console.log("post new Fahrt");
			     							externalRequest.end();
					});

				//Fahrt löschen
app.delete('/fahrten/:id', jsonParser, function (req, res) {
												var message="";
								    		var options = {
								           			host: 'localhost',
								           			port: '3000',
								           			path: '/fahrten/'+req.params.id,
								           			method: 'DELETE'
								   			}

												var externalRequest = http.request(options, function(externalResponse){
			                        console.log('Fahrt löschen');
															externalResponse.on("data", function(chunk) {
																console.log("body: " + chunk);
																message=chunk;
																res.send(message);
										    				res.end();
															});
							    			});
												externalRequest.setHeader("content-type", "text/plain");
												externalRequest.end();
			          		});

//nodeMailer
app.post('/send', function(req, res){
	console.log('IN MAIL');
	console.log(req.body);
	var transporter = nodeMailer.createTransport(transport, [defaults]);

	var mailOptions = {
		from: 'Mitfahergelegenheit <mf@gmail.com>',
		to: req.body.to,
		subject: 'Bestellestätigung',
		text:'Sie haben folgende Fahrt bestellt:',
		html: '<ul><li>Start : ' + req.body.start +'</li><li>Ziel : ' + req.body.ziel +
		'</li><p> Kontaktdaten :</p><ul><li> Nachname :' + req.body.nachname+ '</li><li>Vorname : ' +req.body.vorname+
		'<li>Tel : '+req.body.tel+'</li><li>Handy :'+req.body.mobil+ '</li><li>Email :'+req.body.email+
		'<li>Fahrzeug : '+req.body.car+'</li></ul>'
	};

	transporter.sendMail(mailOptions, function(err){
		if(err){
			console.log('Mail nicht gesendet');
			res.send('Mail nicht gesendet');
		}
		else{
			console.log('Mail gesendet');
			res.send('Message sand');
		}
	});
});

    app.listen(serverPort, function(){
      console.log("Server gestartet");
    });
