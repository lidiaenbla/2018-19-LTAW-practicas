var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const PORT = 8000
var n_users = 0;
var content;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  console.log("Recurso solicitado: /")
});

app.get('/login.html', function(req, res){
  res.sendFile(__dirname + '/login.html');
  console.log("Recurso solicitado: /")
});

app.get('/client.js', function(req, res){
  res.sendFile(__dirname + '/client.js');
  console.log("Recurso solicitado: /client.js")
});

http.listen(PORT, function(){
  console.log("Arrancando servidor en puerto " + PORT + "...\n")
});

io.on('connection', function(socket){
  console.log('--> Usuario conectado');

  n_users += 1;
  socket.id = "User_" + n_users

  console.log("ID del usuario: " + socket.id)
  console.log("Número de usuarios en el chat: " + n_users);

  socket.emit('new_message', 'Hola ' + "<strong>"+socket.id + "</strong>" + ". Bienvenido/a al chat.</p>");
  io.emit('new_message', "<strong>"+socket.id + "</strong>" + ' se ha conectado al chat</p>');

  socket.on('disconnect', function(){
    console.log('--> Usuario Desconectado');
    io.emit('new_message', "<strong>"+socket.id + "</strong>"+ ' ha salido del chat</p>'); //io.emit es broadcast
    n_users -= 1;
    console.log("Número de usuarios en el chat: " + n_users);
  });

  socket.on('new_message', client_msg => {

    console.log("--> Mensaje recibido: " + client_msg)

    var server_msg = ""

    if (client_msg.startsWith("/")) {
      switch(client_msg) {
        case "/help":
          server_msg = "<p>Lista de comandos: /help, /list, /hello, /date</p>"
          socket.emit('new_message', server_msg)
          console.log("Respuesta a /help")
        break;
        case "/list":
          server_msg = "<p>Número de usuarios conectados: </p>" + n_users
          socket.emit('new_message', server_msg)
          console.log("Respuesta a /list")
        break;
        case "/hello":
          socket.emit('new_message', "<p>Hola</p>")
          console.log("Respuesta a /hello")
        break;
        case "/date":
          var date = new Date()
          server_msg = "<p>" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + "</p>"
          socket.emit('new_message', server_msg)
          console.log("Respuesta a /date")
        break;
        default:
          socket.emit('new_message', '<p>Comando no encontrado</p>')
          console.log("Comando no encontrado")
      }
    } else {
      client_msg = "<strong>"+ socket.id + "</strong>" + ": " + client_msg + "</p>"
      io.emit('new_message', client_msg);
    }
  })

  socket.on('new_user', client_login => {

      var server_msg = "";
      var client_msg = "El usuario <strong>"+ socket.id + "</strong> ha cambiado su nick a: ";
      socket.id = client_login;
      client_msg += "<strong>"+ socket.id + "</strong>";
      io.emit('new_message', client_msg);

  })

});
