import { SOCKET_SERVER_MESSAGES, SOCKET_CLIENT_MESSAGES } from "./messages";

let playersList = []; // local state for users
export const messageHandler = (socket) => {
  const addUserToGame = (newUser) => {
    playersList.push({ id: socket.id, userName: newUser.userName, score: 0 });
    socket.broadcast.emit(SOCKET_CLIENT_MESSAGES.USER_JOIN, {
      newUser,
      playersList,
    });
  };

  const newGameCreated = ({ hostName }) => {
    const newUser = { id: socket.id, userName: hostName, score: 0 };
    playersList = [newUser];
    socket.broadcast.emit(SOCKET_CLIENT_MESSAGES.USER_JOIN, {
      newUser,
      playersList,
    });
  };

  const socketDisconnect = () => {
    playersList = playersList.filter((user) => user.id !== socket.id);
    socket.broadcast.emit(SOCKET_CLIENT_MESSAGES.USER_DISCONNECT, {
      id: socket.id,
      playersList,
    });
  };

  socket.on("disconnect", socketDisconnect);
  socket.on(SOCKET_SERVER_MESSAGES.ADD_USER_TO_GAME, addUserToGame);
  socket.on(SOCKET_SERVER_MESSAGES.NEW_GAME_CREATED, newGameCreated);
};
