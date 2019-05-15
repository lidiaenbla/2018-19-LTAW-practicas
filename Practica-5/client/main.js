const electron = require('electron');
var ipcMain = electron.ipcMain;
const io = require('socket.io-client');
const socket = io('http://localhost:8000');

console.log("Lauching electron...")

electron.app.on('ready', ()=>{
  console.log("Event Ready!")

  // Creating UI
  win = new electron.BrowserWindow({
    width: 1200,
    height: 900
  })

  win.loadFile('index.html');

  win.on('close', function() {
    console.log("Closing electron...")
    win.removeAllListeners('close');
 });

 win.webContents.once('dom-ready', () => {

  const socket = io('http://localhost:8000');

  socket.on('server_message', msg =>{
    console.log(msg)
    win.webContents.send('server_message', msg);

  });

  socket.on('Welcome', msg =>{
    console.log(msg)
    win.webContents.send('Welcome', msg);
  });

  socket.on('new_message', msg => {
    win.webContents.send('new_message', msg);
  });

  socket.on('new_user', client_login => {
    win.webContents.send('new_user', client_login);
  });

  ipcMain.on('send_chat_msg', (event,payload) =>{
    socket.emit('new_message', payload);
  });

  ipcMain.on('send_login', (event,payload) =>{
    socket.emit('new_user', payload);
  });

  });

});
