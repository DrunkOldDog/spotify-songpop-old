import { Button, Container, Heading, Input, Text } from "@chakra-ui/react";
import { Navbar } from "@layout/Navbar";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRef } from "react";
import { useRouter } from "next/router";
import { postData, SERVER } from "@common/server";

function Home() {
  const { data } = useSession();
  const { push } = useRouter();
  const playlistInputRef = useRef(null);

  const goToGame = async () => {
    const regex = /playlist\/(\w+)/;
    const playlistId = regex.exec(playlistInputRef.current.value)[1];
    if (!playlistId) {
      return;
    }

    const { data } = await postData(SERVER.GAME, { playlistId });
    if (!data.gameId) {
      return;
    }

    push(`/game/create/${data.gameId}?playlistId=${playlistId}`);
  };

  return (
    <>
      <Navbar user={data?.user} signIn={signIn} signOut={signOut} />
      <Container pt={10}>
        {data ? (
          <>
            <Heading as="h1">
              Insert your Spotify Playlist Shareable URL to start playing
            </Heading>
            <Text>
              For instance
              https://open.spotify.com/playlist/11OuS0TQgnaWng2srx0DZv?si=fccb74f4071b4d43
            </Text>
            <Input
              ref={playlistInputRef}
              placeholder="Paste your Spotify Playlist URL"
            />

            <Button onClick={goToGame}>Create Game</Button>
          </>
        ) : (
          <Heading as="h1">Please sign in to play</Heading>
        )}
      </Container>
    </>
  );
}

export default Home;
