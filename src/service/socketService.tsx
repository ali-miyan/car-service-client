import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_WS_URL

const SOCKET_BOOKING_URL = "http://localhost:3003";
const SOCKET_USER_URL = "http://localhost:3000";
const SOCKET_CHAT_URL = "http://localhost:3004";

const useChatSocket = (selectedCompany: null | string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (selectedCompany) {
      const socketInstance = io(BASE_URL || SOCKET_CHAT_URL, {
        path: "/api/chat/socket.io",
        transports: ["websocket"],
      });

      socketInstance.on("connect", () => {
        console.log("Connected to CHAT server");
      });

      socketInstance.on("connect_error", (err) => {
        console.error("Connection error:", err);
      });

      socketInstance.on("disconnect", () => {
        console.log("Disconnected from CHAT server");
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [selectedCompany]);

  return socket;
};

const useBookingSocket = (id: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (id) {
      const socketInstance = io(BASE_URL || SOCKET_BOOKING_URL, {
        path: "/api/order/socket.io",
        transports: ["websocket"],
      });

      socketInstance.on("connect", () => {
        console.log("Connected to BOOKING server");
      });

      socketInstance.on("connect_error", (err) => {
        console.error("Connection error:", err);
      });

      socketInstance.on("disconnect", () => {
        console.log("Disconnected from BOOKING server");
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [id]);

  return socket;
};
const useUserSocket = (id: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (id) {
      const socketInstance = io(BASE_URL || SOCKET_USER_URL, {
        path: "/api/user/socket.io",
        transports: ["websocket"],
      });

      socketInstance.on("connect", () => {
        console.log("Connected to USER server");
      });

      socketInstance.on("connect_error", (err) => {
        console.error("Connection error:", err);
      });

      socketInstance.on("disconnect", () => {
        console.log("Disconnected from USER server");
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [id]);

  return socket;
};

export { useUserSocket, useBookingSocket, useChatSocket };
