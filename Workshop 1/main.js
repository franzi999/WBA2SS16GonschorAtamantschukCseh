var express = require('express');
var app = express();
var serverPort = 8888;

app.use(express.static(__dirname + "/public"));

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

var users = [
{
 "id":1,
 "name":"Ko",
 "nachname":"Kurochka",
 "wohnort":"Koeln",
 "tel":"1434542",
 "mobil":"01572312442",
 "car":"AudiRS7",
 "plaetze":5
},
{
 "id":2,
 "name":"Koko",
 "nachname":"Dolly",
 "wohnort":"Gummersbach",
 "tel":"1434542",
 "mobil":"01572312442",
 "car":"Audi RS6",
 "plaetze":5
}];

app.get("/users", function(req, res) {
        if (req.query.wohnort !== undefined) {
              res.json(users.filter(function (e) {
                return e.wohnort == req.query.wohnort
          	}));
        } else {res.send(users)}
});

app.get("/users/:id", function(req, res) {
       res.send(users.filter(function (n){
         return n.id == req.params.id;
       }));
});

app.delete("/users/:name", function(req, res) {
          for (var i in users){
            if(users[i].name == req.params.name)
               users[i] == 0;
          }
});

app.post("/users", jsonParser, function(req, res){
        users[users.length] = req.body;
        res.send("Neuer User hinzugefügt: " + req.body);
});

app.listen(serverPort, function(){
  console.log("All is fine");
});
