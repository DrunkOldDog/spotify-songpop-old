import { useState, useRef, useEffect } from "react";
import { Button, Container, Heading, Input } from "@chakra-ui/react";
import { SOCKET_SERVER_MESSAGES } from "@common/sockets";
import io from "socket.io-client";
import { SERVER } from "@common/server";

export default function Game() {
  const socketRef = useRef();
  const userInputRef = useRef();
  const [user, setUser] = useState();

  useEffect(() => {
    const disconnectWebSocket = () => {
      socketRef.current.disconnect(true);
    };

    (async () => {
      await fetch(SERVER.SOCKET);
      socketRef.current = io();

      window.addEventListener("beforeunload", disconnectWebSocket);
    })();

    return () => {
      window.removeEventListener("beforeunload", disconnectWebSocket);
    };
  }, []);

  const createUser = () => {
    const newUser = {
      id: socketRef.current.id,
      userName: userInputRef.current.value,
    };
    console.log("adding", newUser);
    setUser(newUser);
    socketRef.current.emit(SOCKET_SERVER_MESSAGES.ADD_USER_TO_GAME, newUser);
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
