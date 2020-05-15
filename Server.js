var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);
io.on('connection', function (socket) {
  console.log('Someone connected' + socket.id);
  socket.on('user-joined', (data) => {
    console.log(data + ' joined');
    io.sockets.emit('server-noti-user-joined', data);
  });
  socket.on('user-send-message', (data) => {
    console.log('da nhan tin nhan ', data);
    io.sockets.emit('server-send-message', data);
  });
});
