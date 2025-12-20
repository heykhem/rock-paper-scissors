// server/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("joinGame", (roomId) => {
    socket.join(roomId);
  });

  socket.on("playerMove", (data) => {
    socket.to(data.roomId).emit("opponentMove", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => console.log("Socket server running"));
