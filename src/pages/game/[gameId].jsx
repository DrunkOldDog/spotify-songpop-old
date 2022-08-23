import { useState, useRef, useEffect } from "react";
import { Button, Container, Heading, Input } from "@chakra-ui/react";
import { SOCKET_SERVER_MESSAGES } from "@common/sockets";
import { useSocket } from "@hooks/useSocket";

export default function Game() {
  const socket = useSocket();
  const userInputRef = useRef();
  const [user, setUser] = useState();

  useEffect(() => {
    if (!socket) return;

    const disconnectWebSocket = () => {
      socket.disconnect(true);
    };

    window.addEventListener("beforeunload", disconnectWebSocket);

    return () => {
      window.removeEventListener("beforeunload", disconnectWebSocket);
    };
  }, [socket]);

  const createUser = () => {
    const newUser = {
      id: socket.id,
      userName: userInputRef.current.value,
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

  return <h1>Hey!</h1>;
}
