var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var redis = require('redis');
var client = redis.createClient();

var app = express();
var serverPort = 3000;

app.use(bodyParser.json());


//USERS########################################################################
app.post('/users',function(req, res){
    var newUser = req.body;
    client.incr('id:users',function(err,rep){
        newUser.id = rep;
        client.set('user:'+newUser.id, JSON.stringify(newUser),function(err,rep){
                    res.json(newUser);
                });
        });
});


app.delete('/users/:id', function(req, res){
    client.del('user:'+req.params.id, function(err, rep) {
        if (rep == 1) {
            res.status(200).type('text').send('User '+ req.params.id + ' gelöscht');
        }
        else {
            res.status(404).type('text').send('User ' + req.params.id + ' existiert nicht');
        }
    });
});

app.get('/users', function (req, res) {
   client.keys('user:*', function(err,rep){
       var users = [];
       if(rep.length == 0){
       res.json(users);
       return;
   }
       client.mget(rep,function(err,rep){
       rep.forEach(function(val){
           users.push(JSON.parse(val));
       });
       /*users = users.map(function(user){
        return {Vorname: user.vorname, nachname : user.nachname,
                Email: user.email, Tel: user.tel, Mobil: user.mobil, Auto: user.car,
                Id: user.id};
        });*/
      res.json(users);
   });
  });
});

app.get('/users/:id', function(req, res){
    client.get('user:'+ req.params.id, function(err, rep){
        if (rep) {
            res.type('json').send(rep);
        }
        else{
            res.status(404).type('text').send('User '+ req.params.id+
                                        ' existiert nicht');
        }
    });
});

//alle User löschen???

/*app.delete('/users', function(req, res) {
    client.keys('user:*', function(err, rep){
      console.dir(rep);
        client.del('rep', function(err, rep){
        if (rep == 1) {
            res.status(200).type('text').send('Alle User gelöscht');
          }
          else {
            res.status(404).type('text').send('Der User existiert nicht');
        }
      });
  });
});*/


app.delete('/users/:id', function(req, res){
    client.del('user:'+req.params.id, function(err, rep) {
        if (rep == 1) {
          res.status(200).type('text').send('User '+ req.params.id + ' gelöscht');
        }
        else {
          res.status(404).type('text').send('Der User ' + req.params.id + ' existiert nicht');
        }
    });
});

app.put('/users/:id', jsonParser, function(req, res){
            var neu = req.body;
            neu.id = req.params.id;

            client.set('user:'+req.params.id, JSON.stringify(neu),  function(err, rep){
                res.status(200).type('json').send(neu);
            });

});
//########################################################################USERS


//FAHRT########################################################################


app.post('/fahrten',function(req, res){
    var newFahrt = req.body;
    client.incr('id:fahrten',function(err,rep){
        newFahrt.id = rep;
        client.set('fahrt:'+newFahrt.id, JSON.stringify(newFahrt),function(err,rep){
                    res.json(newFahrt);
                });
        });
});


app.delete('/fahrt/:id', function(req, res){
    client.del('fahrt:'+req.params.id, function(err, rep) {
        if (rep == 1) {
            res.status(200).type('text').send('Die Fahrt '+ req.params.id + ' gelöscht');
        }
        else {
            res.status(404).type('text').send('Die Fahrt' + req.params.id + 'existiert nicht');
        }
    });
});


app.get('/fahrten', function (req, res) {
   client.keys('fahrt:*', function(err,rep){
       var fahrten = [];
       if(rep.length == 0){
       res.json(fahrten);
       return;
   }
       client.mget(rep,function(err,rep){
       rep.forEach(function(val){
           fahrten.push(JSON.parse(val));
       });
       /*fahrten = fahrten.map(function(fahrt){
        return {Start: fahrt.start, Ziel : fahrt.ziel, Platze : fahrt.plaetze,
                ID: fahrt.id};
        });*/
      res.json(fahrten);
    });
  });
});

//Fahrt nach start sortieren
app.get('/fahrten/:start', function (req, res) {
   client.keys('fahrt:*', function(err,rep){
       var fahrten = [];
       if(rep.length == 0){
       res.json(fahrten);
       return;
   }
       client.mget(rep,function(err,rep){
       rep.forEach(function(val){
           fahrten.push(JSON.parse(val));
       });

         res.json(fahrten.filter(function(n){
           if(n.start == req.params.start)
            return {Start: n.start, Ziel : n.ziel, Platze : n.plaetze,
              ID: n.id};
            else return null;
         }));
    });
  });
});

//Fahrt nach freien PLaetzen sortieren
/*app.get('/fahrten/:plaetze', function (req, res) {
   client.keys('fahrt:*', function(err,rep){
       var fahrten = [];
       if(rep.length == 0){
       res.json(fahrten);
       return;
   }
       client.mget(rep,function(err,rep){
       rep.forEach(function(val){
           fahrten.push(JSON.parse(val));
       });

         res.json(fahrten.filter(function(n){
           if(n.plaetze >= req.params.plaetze)
            return {Start: n.start, Ziel : n.ziel, Platze : n.plaetze,
              ID: n.id};
            else return null;
         }));
    });
  });
});*/

app.get('/fahrten/:id', function(req, res){
    client.get('fahrt:'+ req.params.id, function(err, rep){
        if (rep) {
            res.type('json').send(rep);
        }
        else{
            res.status(404).type('text').send('Fahrt '+ req.params.id+
                                        ' existiert nicht');
        }
    });
});


app.put('/fahrten/:id', jsonParser, function(req, res){
            var newFahrt = req.body;
            newFahrt.id = req.params.id;

            client.set('fahrt:'+req.params.id, JSON.stringify(newFahrt),  function(err, rep){
                res.status(200).type('json').send(newFahrt);
            });

});

//FAHRT########################################################################

app.listen(serverPort, function(){
  console.log("Server gestartet");
});
