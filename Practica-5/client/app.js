var ipcRenderer = require('electron').ipcRenderer;//

function main() {
  var recieving = false;
  var send = document.getElementById("send")
  var acept = document.getElementById("acept")
  var display = document.getElementById('display')
  var msg = document.getElementById("msg")
  var login = document.getElementById("login")

  msg.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) {
        if (msg.value != ""){
          recieving = true;
          ipcRenderer.send('send_chat_msg', msg.value);
          console.log("Message sent.");
          msg.value = "";
        }
      }
  });

  login.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) {
        if (login.value != ""){
          recieving = true;
          ipcRenderer.send('send_login', login.value);
          console.log("Message sent.");
          msg.value = "";
        }
      }
  });

  send.onclick = () => {
    if (msg.value != ""){
      recieving = true;
      ipcRenderer.send('new_message', msg.value);
      console.log("Message sent.");
      msg.value = "";
    }
  }
  acept.onclick = () => {
    if (login.value != ""){
      recieving = true;
      ipcRenderer.send('new_user', login.value);
      console.log("Login change.");
      msg.value = "";
    }
  }

  ipcRenderer.on('Welcome', (event,msg) => {
    display.innerHTML += msg;
    display.innerHTML += ("\n");
  });

  ipcRenderer.on('new_message', (event,msg) => {
    if(!recieving){
      recieving = true;
    }else{
      display.innerHTML += msg;
      display.innerHTML += ("\n");
    }
  });

  ipcRenderer.on('new_user', (event,login) => {
    if(!recieving){
      recieving = true;
    }else{
      display.innerHTML += login;
      display.innerHTML += ("\n");
    }
  });
}
