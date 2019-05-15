const app = require('express')();
const http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = 0;

const PORT = 8000
var n_users = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  console.log("Recurso solicitado: /")
});

//  Lauching Server
http.listen(PORT, function(){
  console.log("Arrancando servidor en puerto " + PORT + "...\n")
});

io.on('connection', function(socket){
  console.log('--> Usuario conectado');

  n_users += 1;
  socket.id = "User_" + n_users

  console.log("ID del usuario: " + socket.id)
  console.log("Número de usuarios en el chat: " + n_users);

  socket.emit('new_message', 'Hola ' + socket.id + ". Bienvenido/a al chat");
  io.emit('new_message', socket.id  + ' se ha conectado al chat');

  socket.on('disconnect', function(){
    console.log('--> Usuario Desconectado');
    io.emit('new_message', socket.id +  ' ha salido del chat');
    n_users -= 1;
    console.log("Número de usuarios en el chat: " + n_users);
  });

  socket.on('new_message', client_msg => {

    console.log("--> Mensaje recibido: " + client_msg)

    var server_msg = ""

    if (client_msg.startsWith("/")) {
      switch(client_msg) {
        case "/help":
          server_msg = "Lista de comandos: /help, /list, /hello, /date"
          socket.emit('new_message', server_msg)
        break;
        case "/list":
          server_msg = "Número de usuarios conectados: " + n_users
          socket.emit('new_message', server_msg)
        break;
        case "/hello":
          socket.emit('new_message', "Hola")
        break;
        case "/date":
          var date = new Date()
          server_msg = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
          socket.emit('new_message', server_msg)
        break;
        default:
          socket.emit('new_message', 'Comando no encontrado')
      }
    } else {
      client_msg = socket.id +  ": " + client_msg + ""
      io.emit('new_message', client_msg);
    }
  });

  socket.on('new_user', client_login => {

      var server_msg = "";
      var client_msg = "El usuario "+ socket.id + " ha cambiado su nick a: ";
      socket.id = client_login;
      client_msg += socket.id ;
      io.emit('new_message', client_msg);

  })

});
