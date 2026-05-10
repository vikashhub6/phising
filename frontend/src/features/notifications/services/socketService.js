import { io } from "socket.io-client";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

let socket = null;

export const connectSocket = (userId) => {
  if (socket) return socket;
  socket = io(BACKEND_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  socket.on("connect", () => {
    console.log("✅ Socket connected");
    socket.emit("join", userId);
  });
  socket.on("disconnect", () => console.log("❌ Socket disconnected"));
  return socket;
};

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null; }
};

export const getSocket = () => socket;
