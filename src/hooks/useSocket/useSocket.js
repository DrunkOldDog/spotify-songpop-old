import { useEffect, useState } from "react";
import { SERVER } from "@common/server";
import io from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    (async () => {
      await fetch(SERVER.SOCKET);
      const socketio = io();
      setSocket(socketio);

      return () => socketio.disconnect();
    })();
  }, []);

  return socket;
};
