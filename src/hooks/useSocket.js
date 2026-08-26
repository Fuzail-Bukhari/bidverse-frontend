import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let socket = null;

export const getSocket = () => socket;

const useSocket = () => {
  const { isAuthenticated, user } = useAuthStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && !socket) {
      socket = io(API_URL, {
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("🔌 Socket connected:", socket.id);
        if (user?._id) {
          socket.emit("join_user_room", user._id);
        }
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });

      socketRef.current = socket;
    }

    return () => {
      if (socket && !isAuthenticated) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [isAuthenticated, user]);

  return socket;
};

export default useSocket;