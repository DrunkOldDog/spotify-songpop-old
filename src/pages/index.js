import { Button, Container, Heading } from "@chakra-ui/react";
import { getData, SERVER } from "@common/server";
import { Navbar } from "@layout/Navbar";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { DebounceSelect } from "@components/DebounceSelect";

function Home() {
  const { data } = useSession();
  const [selectedArtist, setSelectedArtist] = useState();

  const onRemoteSearch = async (inputValue) => {
    const { data: artistsList } = await getData(SERVER.SEARCH_ARTISTS, {
      params: { artistName: inputValue },
    });

    return artistsList.map((artist) => ({
      value: artist.id,
      label: artist.name,
      ...artist,
    }));
  };

  return (
    <>
      <Navbar user={data?.user} signIn={signIn} signOut={signOut} />
      <Container pt={10}>
        {data ? (
          <>
            <Heading as="h1">Select your artist to start playing</Heading>
            <DebounceSelect
              remoteRetriever={onRemoteSearch}
              onSelect={setSelectedArtist}
            />

            <Button disabled={!selectedArtist}>Create Game</Button>
          </>
        ) : (
          <Heading as="h1">Please sign in to play</Heading>
        )}
      </Container>
    </>
  );
}

export default Home;
