import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentToken: string | null = null;

export const getChatSocket = (): Socket | null => {
  if (!socket) {
    const token = localStorage.getItem("access_token");
    if (token && token !== "undefined" && token !== "null") {
      return connectChatSocket(token);
    }
  }
  return socket;
};

export const isSocketConnected = (): boolean => {
  return Boolean(socket?.connected);
};

export const connectChatSocket = (token: string): Socket => {
  // 1. Nếu socket đã tồn tại và cùng token -> Tái sử dụng socket instance (Singleton tránh race condition)
  if (socket && currentToken === token) {
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  // 2. Nếu token thay đổi hoặc socket cũ cần reset -> Ngắt kết nối trước
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  currentToken = token;
  const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:3000/chat";

  socket = io(wsUrl, {
    auth: {
      token: `Bearer ${token}`, // WsJwtGuard backend bóc tách token tại client.handshake.auth.token
    },
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("🟢 [Socket.IO] Đã kết nối WebSockets Gateway /chat:", socket?.id);
    // Tự động đăng ký nhận thông báo real-time của chính mình
    socket?.emit("subscribe_notifications");
  });

  socket.on("connect_error", (err) => {
    console.error("🔴 [Socket.IO] Lỗi kết nối WebSocket:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.warn("🟡 [Socket.IO] Mất kết nối WebSocket:", reason);
  });

  return socket;
};

export const disconnectChatSocket = (): void => {
  if (socket) {
    console.log("🔌 [Socket.IO] Đang ngắt kết nối WebSocket...");
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
};
