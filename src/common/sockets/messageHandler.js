import { defaultGameStatusState, GAME_STATUS } from "@common/constants";
import { SOCKET_SERVER_MESSAGES, SOCKET_CLIENT_MESSAGES } from "./messages";

let playersList = []; // local state for users
const gameStatus = { ...defaultGameStatusState };
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

  const gameStatusChange = (newStatus) => {
    const { status = gameStatus.status, options = [], currentSong } = newStatus;
    gameStatus.status = status;
    gameStatus.options = options;
    gameStatus.currentSong = currentSong;
    socket.broadcast.emit(SOCKET_CLIENT_MESSAGES.GAME_STATUS, gameStatus);
  };

  const scoreUpdate = (socketId) => {
    playersList = playersList.map((player) => {
      if (player.id === socketId) {
        return { ...player, score: player.score + 1 };
      }

      return player;
    });
    socket.broadcast.emit(SOCKET_CLIENT_MESSAGES.PLAYER_SCORE, playersList);
  };

  const gameFinished = () => {
    gameStatus.status = GAME_STATUS.FINISHED;
    socket.broadcast.emit(SOCKET_CLIENT_MESSAGES.GAME_DATA, {
      gameStatus,
      playersList,
    });
  };

  /* Only works on initial render because data persists as empty */
  const getGameData = (callback = () => {}) =>
    callback({ playersList, gameStatus });

  socket.on("disconnect", socketDisconnect);
  socket.on(SOCKET_SERVER_MESSAGES.ADD_USER_TO_GAME, addUserToGame);
  socket.on(SOCKET_SERVER_MESSAGES.GET_GAME_DATA, getGameData);
  socket.on(SOCKET_SERVER_MESSAGES.NEW_GAME_CREATED, newGameCreated);
  socket.on(SOCKET_SERVER_MESSAGES.GAME_STATUS_CHANGE, gameStatusChange);
  socket.on(SOCKET_SERVER_MESSAGES.PLAYER_SCORE_UPDATE, scoreUpdate);
  socket.on(SOCKET_SERVER_MESSAGES.GAME_FINISHED, gameFinished);
};
