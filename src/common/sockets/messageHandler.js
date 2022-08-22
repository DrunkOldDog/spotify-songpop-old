export const messageHandler = (_, socket) => {
  const addUserToGame = (msg) => socket.broadcast.emit("userJoin", msg);

  socket.on("addUserToGame", addUserToGame);
};
