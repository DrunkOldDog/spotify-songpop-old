import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Input,
} from "@chakra-ui/react";
import {
  SOCKET_CLIENT_MESSAGES,
  SOCKET_SERVER_MESSAGES,
} from "@common/sockets";
import { useSocket } from "@hooks/useSocket";
import { PlayersBadges } from "@components/PlayersBadges";
import { defaultGameStatusState, GAME_STATUS } from "@common/constants";
import { SongOptions } from "@components/SongOptions";
import { ScoreList } from "@components/ScoreList";
import { GameNavbar } from "@layout/Navbar/GameNavbar";

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
          <Center height={"100vh"} flexDir="column">
            <Box mb={8}>
              <Heading as="h2" size={"lg"} mb={2}>
                Add your nick to start
              </Heading>
              <Input ref={userInputRef} placeholder="E.g. MalumaBaby96" />
            </Box>

            <Button type="submit">Create User</Button>
          </Center>
        </form>
      </Container>
    );
  }

  if (gameStatus.status === GAME_STATUS.FINISHED) {
    return (
      <Container background="blackAlpha.900" color="#fff" padding={0}>
        <GameNavbar player={user} />
        <Container height={"100vh"} py={8}>
          <Heading alignSelf={"flex-start"} as="h4" pb={4} fontSize={24}>
            Game score:
          </Heading>
          <ScoreList playersScore={playersList} />
        </Container>
      </Container>
    );
  }

  return (
    <Container background="blackAlpha.900" color="#fff" padding={0}>
      <GameNavbar player={user} />
      <Center flexDir={"column"} height="100vh" px={12}>
        {gameStatus.status === GAME_STATUS.NOT_STARTED && (
          <PlayersBadges playersList={playersList} />
        )}

        {gameStatus.status === GAME_STATUS.STARTED && (
          <SongOptions
            songOptions={gameStatus.options}
            currentSong={gameStatus.currentSong}
            isSongSelected={!!selectedSong}
            onSongSelect={onSongSelect}
          />
        )}
      </Center>
    </Container>
  );
}
