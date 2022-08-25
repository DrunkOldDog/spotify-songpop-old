import { useState, useRef, useEffect } from "react";
import {
  Button,
  Center,
  Container,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import {
  SOCKET_CLIENT_MESSAGES,
  SOCKET_SERVER_MESSAGES,
} from "@common/sockets";
import { useSocket } from "@hooks/useSocket";
import { PlayersBadges } from "@components/PlayersBadges";
import { defaultGameStatusState, GAME_STATUS } from "@common/constants";
import { SongOptions } from "@components/SongOptions";
import { SONGS_LIMIT } from "@hooks/useCreateGame";
import { ScoreList } from "@components/ScoreList";

export default function Game() {
  const socket = useSocket();
  const userInputRef = useRef();
  const [user, setUser] = useState();
  const [gameStatus, setGameStatus] = useState(defaultGameStatusState);
  const [playersList, setPlayersList] = useState([]);
  const [selectedSong, setSelectedSong] = useState();

  const getGameData = ({ playersList, gameStatus }) => {
    setGameStatus(gameStatus);
    setPlayersList(playersList);
  };

  useEffect(() => {
    if (!socket) return;

    const onUserJoin = ({ playersList }) => {
      setPlayersList(playersList);
    };

    const disconnectWebSocket = () => {
      socket.disconnect(true);
    };

    socket.on(SOCKET_CLIENT_MESSAGES.USER_JOIN, onUserJoin);
    socket.on(SOCKET_CLIENT_MESSAGES.GAME_DATA, getGameData);
    socket.on(SOCKET_CLIENT_MESSAGES.GAME_STATUS, (gameStatus) => {
      setGameStatus(gameStatus);
      setSelectedSong(undefined);
    });
    socket.emit(SOCKET_SERVER_MESSAGES.GET_GAME_DATA, getGameData);
    window.addEventListener("beforeunload", disconnectWebSocket);

    return () => {
      socket.off(SOCKET_CLIENT_MESSAGES.USER_JOIN, onUserJoin);
      window.removeEventListener("beforeunload", disconnectWebSocket);
    };
  }, [socket]);

  const createUser = () => {
    const newUser = {
      id: socket.id,
      userName: userInputRef.current.value,
      score: 0,
    };
    setUser(newUser);
    socket.emit(SOCKET_SERVER_MESSAGES.ADD_USER_TO_GAME, newUser);
  };

  const onSongSelect = (song) => {
    if (song.id === gameStatus.currentSong?.id) {
      setUser({ ...user, score: user.score + 1 });
      socket.emit(SOCKET_SERVER_MESSAGES.PLAYER_SCORE_UPDATE, socket.id);
    }
    setSelectedSong(song);
  };

  if (!user) {
    return (
      <Container>
        <form onSubmit={createUser}>
          <Heading as="h2">Add a username to start </Heading>
          <Input ref={userInputRef} />
          <Button type="submit">Create User</Button>
        </form>
      </Container>
    );
  }

  if (gameStatus.status === GAME_STATUS.FINISHED) {
    return (
      <Container background="blackAlpha.900" color="#fff">
        <Center flexDir={"column"} height="100vh" px={12}>
          <Heading as="h4" fontSize={"lg"}>
            Game score:
          </Heading>
          <ScoreList playersScore={playersList} />
        </Center>
      </Container>
    );
  }

  return (
    <Container background="blackAlpha.900" color="#fff">
      <Center flexDir={"column"} height="100vh" px={12}>
        {gameStatus.status === GAME_STATUS.NOT_STARTED && (
          <PlayersBadges playersList={playersList} />
        )}

        {gameStatus.status === GAME_STATUS.STARTED && (
          <>
            <Text>
              Score {user.score}/{SONGS_LIMIT}
            </Text>
            <SongOptions
              songOptions={gameStatus.options}
              currentSong={gameStatus.currentSong}
              isSongSelected={!!selectedSong}
              onSongSelect={onSongSelect}
            />
          </>
        )}
      </Center>
    </Container>
  );
}
