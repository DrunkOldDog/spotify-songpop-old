import { useMemo } from "react";
import { io } from "socket.io-client";

export const useSpecificSocket = (socketId) => {
  const socket = useMemo(
    () => io("http://localhost:3000", { path: `/${socketId}/` }),
    [socketId]
  );

  return socket;
};
