/*var fahrt=[];
var u_id;
alert("fahrt holen");
$.ajax({
  type: 'GET',
  host: 'localhost',
  url: '/fahrten/' + <%= fahrtID %> ,
  data:{start: 'val1',
        ziel: 'val2',
        plaetze: 'val3',
        u_id: 'val4'
        },
  dataType: 'json',
  success: function(data){
    alert(data);
    u_id = data.u_id;
    alert('U_id: 'u_id);
    console.log(JSON.stringify(data));
  }
});*/

$(function(){
  $("#putf").click(function(event) {
    alert("Put ++++++++");
    //Abschicken und Seite neu laden unterbinden
    //event.preventDefault();
    var newUser = {
      vorname: $("#vorname").val(),
      nachname: $("#nachname").val(),
      tel: $("#tel").val(),
      mobil: $("#mobil").val(),
      mail: $("#email").val(),
      car: $("#car").val(),
      id: <%= userID %>
    };
    $.ajax({
      type: 'PUT',
      host: 'localhost',
      url: '/user/' + <%= userID %> ,
      contentType: 'application/json',
      data: JSON.stringify(newUser),
      success: function(newUser){
        alert('success');
        console.log(JSON.stringify(newUser));
      }
    });
  });
});
