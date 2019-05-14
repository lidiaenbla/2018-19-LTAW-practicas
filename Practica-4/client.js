function main() {
  console.log("Ejecutado client.js")

  var socket = io(); //creamos websocket

  var send = document.getElementById('send')
  var acept = document.getElementById('acept')
  var display = document.getElementById('display')
  var msg = document.getElementById("msg")
  var login = document.getElementById("login")

  msg.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("send").click()
    }
  });

  login.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("login").click()
    }
  });

  send.onclick = () => {
    socket.emit('new_message', msg.value);
    document.getElementById('msg').value = ""
    console.log("--> Mensaje emitido: " + msg.value)
  }

  acept.onclick = () => {
    socket.emit('new_user', login.value);
    document.getElementById('login').value = ""
    console.log("--> Usuario nuevo: " + login.value)
  }

  socket.on('new_message', msg => {
    display.innerHTML = display.innerHTML + "<p>>>> "+ msg;
    console.log("--> Mensaje recibido: " + msg)
  });

}
