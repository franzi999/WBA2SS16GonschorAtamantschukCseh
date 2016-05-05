var fs = require('fs');
var chalk = require('chalk');

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

//Farbige Ausgabe
            for(var i in wk.wolkenkratzer) {
              console.log(chalk.red("Name: " + wk.wolkenkratzer[i].name));
              console.log(chalk.red("Stadt: " + wk.wolkenkratzer[i].stadt));
              console.log(chalk.red("Hoehe: " + wk.wolkenkratzer[i].hoehe));
              console.log("---------------------------------------------");
            }
