const PORT = process.env.PORT || 3000;
var express = require("express");
var app = express();
var server = require("http").Server(app).listen(PORT);
var io = require("socket.io")(server);

io.on("connection", function (socket) {
  console.log("Someone connected" + socket.id);
  socket.on("user-joined", (data) => {
    console.log(data + " joined");
    io.emit("server-noti-user-joined", data);
  });
  socket.on("user-send-message", (data) => {
    console.log("da nhan tin nhan ", data);
    io.emit("server-send-message", data);
  });
});
