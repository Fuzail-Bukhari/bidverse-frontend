import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore";

const SocketContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io(API_URL, {
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        if (user?._id) {
          newSocket.emit("join_user_room", user._id);
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);

export default SocketContext;