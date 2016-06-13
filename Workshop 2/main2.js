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
       users = users.map(function(user){
        return {Vorname: user.vorname, nachname : user.nachname,
                Email: user.mail, Tel: user.tel, Id: user.id};
        });
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

app.delete('/users', function(req, res) {
    client.keys('user:*', function(err, rep){ // Alle Keys holen, die mit "user:" beginnen
      console.dir(rep);
      var i = 1;
      for (i in rep){
        client.del('user:i', function(err, rep){
         if (rep == 1) {
            res.status(200).type('text').send('User '+ i + ' gelöscht');
          }
          else {
            res.status(404).type('text').send('Der User ' + i + ' existiert nicht');
        }
      });
    }
  });
});

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




















//FAHRT########################################################################

app.listen(serverPort, function(){
  console.log("Server gestartet");
});
