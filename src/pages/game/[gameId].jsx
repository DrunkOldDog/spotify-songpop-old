import { useState, useRef, useEffect } from "react";
import { Button, Center, Container, Heading, Input } from "@chakra-ui/react";
import {
  SOCKET_CLIENT_MESSAGES,
  SOCKET_SERVER_MESSAGES,
} from "@common/sockets";
import { useSocket } from "@hooks/useSocket";
import { PlayersBadges } from "@components/PlayersBadges";

export default function Game() {
  const socket = useSocket();
  const userInputRef = useRef();
  const [user, setUser] = useState();
  const [playersList, setPlayersList] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const onUserJoin = ({ playersList }) => {
      setPlayersList(playersList);
    };

    const disconnectWebSocket = () => {
      socket.disconnect(true);
    };

    socket.on(SOCKET_CLIENT_MESSAGES.USER_JOIN, onUserJoin);
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

  return (
    <Container background="blackAlpha.900" color="#fff">
      <Center flexDir={"column"} height="100vh" px={12}>
        <PlayersBadges playersList={playersList} />
      </Center>
    </Container>
  );
}
