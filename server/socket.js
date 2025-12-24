import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

export function connectSocket(userId) {
  const socket = io("http://localhost:9000", {
    auth: { userId },
  });

  return socket;
}
