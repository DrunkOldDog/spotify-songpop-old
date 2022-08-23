import { SOCKET_SERVER_MESSAGES, SOCKET_CLIENT_MESSAGES } from "./messages";

export const messageHandler = (socket) => {
  const addUserToGame = (msg) => {
    socket.broadcast.emit(SOCKET_CLIENT_MESSAGES.USER_JOIN, msg);
  };

  const socketDisconnect = () => {
    socket.broadcast.emit(SOCKET_CLIENT_MESSAGES.USER_DISCONNECT, {
      id: socket.id,
    });
  };

  socket.on("disconnect", socketDisconnect);
  socket.on(SOCKET_SERVER_MESSAGES.ADD_USER_TO_GAME, addUserToGame);
};
