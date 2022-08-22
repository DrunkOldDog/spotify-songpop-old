import { useState, useRef, useEffect } from "react";
import { Button, Container, Heading, Input } from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { SOCKET_SERVER_MESSAGES } from "@common/sockets";
import io from "socket.io-client";
import { SERVER } from "@common/server";

export default function Game() {
  const socketRef = useRef();
  const userInputRef = useRef();
  const [user, setUser] = useState();

  useEffect(() => {
    (async () => {
      await fetch(SERVER.SOCKET);
      socketRef.current = io();
    })();
  }, []);

  const createUser = () => {
    const newUser = { id: uuid(), userName: userInputRef.current.value };
    setUser(newUser);
    socketRef.current.emit(SOCKET_SERVER_MESSAGES.ADD_USER_TO_GAME, newUser);
  };

  if (!user) {
    return (
      <Container>
        <Heading as="h2">Add a username to start </Heading>
        <Input ref={userInputRef} />
        <Button onClick={createUser}>Create User</Button>
      </Container>
    );
  }

  return <h1>Hey!</h1>;
}
