var fs = require('fs');
var chalk = require('chalk');

//AUF 1

//Datei einlesen
fs.readFile(__dirname + "/wolkenkratzer.json", function (err,data) {
            var wk = JSON.parse(date.toString());

            //Sortieren nach Hohe
            wk.wolkenkratzer.sort(funktion(a,b)) {

              if (a.hohe > b.hoehe) {
                  return 1;
                }
              if (a.hoehe < b.hoehe) {
                  return -1;
                }
                  return 0;
            }
      });
