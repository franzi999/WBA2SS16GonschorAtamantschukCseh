var redis = require("redis");
var db = redis.createClient();

var express = require('express');
var app = express();
var serverPort = 8888;

db.on("error", function (err) {
    console.log("Error " + err);
});


db.HMSET("users",{ "id": "1", "vorname" : "ko", "nachname" : "koko",
        "email" : "example.com", "tel" : "0157342348",
        "ort" : "Koeln", "plz" : "100500", "str" : "Koelner str",
        "auto" : "Audi RS7", "platz" : "5"});

app.use(express.static(__dirname + "/public"));

//Alle User ausgeben
app.get('/users', function(req, res) {
  db.keys('user:*', function(err, rep){
    console.dir(rep);
    if (rep.length == 0) {
      res.json([]);
      return;
    }
    db.hgetall(rep, function(err, rep){
      var users = rep.map(function(userStringified){
        var user = JSON.parse(userStringified);
        return { vorname: user.name, nachname: user.nachname };
      });
    });
  });
});

//Bestimte fahrt nach Ort ausgeben

app.get('/user/:ort', function(req, res) {
  var datasetKey = 'user:' + req.params.ort;
  db.hmget(datasetKey, function(err, rep) {
    if (rep) {
      res.type('json')
        .send(rep); //Ist ja schon ein String
    }
    else {
      res.status(404)
        .type('text')
        .send('Der Ort ' + req.params.ort + 'wurde nicht gefunden');
    }
  });
});










app.listen(serverPort, function(){
  console.log("Server gestartet");
});
