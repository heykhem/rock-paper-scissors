import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
export const socket = io("http://localhost:3000");

export function joinRoom(roomId) {
  socket.emit("joinGame", roomId);
}

export function sendMove(roomId, move) {
  socket.emit("playerMove", { roomId, move });
}

export function onOpponentMove(callback) {
  socket.on("opponentMove", callback);
}
