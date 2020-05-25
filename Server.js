// const { Client } = require("pg");

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });
// process.env.PORT ||
// const PORT = 3000;
// var express = require("express");
// var app = express();
// app.listen(PORT);
// var server = require("http").Server(app).listen(PORT);
// var io = require("socket.io")(server);

const express = require("express");

var io = require("socket.io")({
  path: "/webrtc",
});

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
io.listen(server);
const peers = io.of("/webrtcPeer");
let connectedPeers = new Map();

io.on("connection", function (socket) {
  console.log("Someone connected " + socket.id);
  socket.on("user-joined", (data) => {
    console.log(data + " joined");
    io.emit("server-noti-user-joined", data);
  });
  socket.on("user-send-message", (data) => {
    console.log("da nhan tin nhan ", data);
    io.emit("server-send-message", data);
  });
});

peers.on("connection", (socket) => {
  console.log(socket.id);
  socket.emit("connection-success", { success: socket.id });

  connectedPeers.set(socket.id, socket);

  socket.on("disconnect", () => {
    console.log("disconnected");
    connectedPeers.delete(socket.id);
  });

  socket.on("offerOrAnswer", (data) => {
    // send to the other peer(s) if any
    for (const [socketID, socket] of connectedPeers.entries()) {
      // don't send to self
      if (socketID !== data.socketID) {
        console.log(socketID, data.payload.type);
        socket.emit("offerOrAnswer", data.payload);
      }
    }
  });

  socket.on("candidate", (data) => {
    // send candidate to the other peer(s) if any
    for (const [socketID, socket] of connectedPeers.entries()) {
      // don't send to self
      if (socketID !== data.socketID) {
        console.log(socketID, data.payload);
        socket.emit("candidate", data.payload);
      }
    }
  });
});
