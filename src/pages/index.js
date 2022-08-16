import { Button, Container, Heading } from "@chakra-ui/react";
import { getData, SERVER } from "@common/server";
import { Navbar } from "@layout/Navbar";
import { AsyncSelect } from "chakra-react-select";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRef, useState } from "react";

function Home() {
  const { data } = useSession();
  const searchRef = useRef(null);
  const [selectedArtist, setSelectedArtist] = useState();

  return (
    <>
      <Navbar user={data?.user} signIn={signIn} signOut={signOut} />
      <Container pt={10}>
        <Heading as="h1">Select your artist to start playing</Heading>
        <AsyncSelect
          isClearable
          onChange={setSelectedArtist}
          placeholder="Search your favorite artist"
          size="md"
          loadOptions={(inputValue, callback) => {
            if (searchRef.current) {
              clearTimeout(searchRef.current);
            }

            /* Added code for debounce multiple requests */
            searchRef.current = setTimeout(async () => {
              const { data: artistsList } = await getData(
                SERVER.SEARCH_ARTISTS,
                {
                  params: { artistName: inputValue },
                }
              );

              const values = artistsList.map((artist) => ({
                value: artist.id,
                label: artist.name,
                ...artist,
              }));

              searchRef.current = null;
              callback(values);
            }, 1000);
          }}
        />

        <Button disabled={!selectedArtist}>Create Game</Button>
      </Container>
    </>
  );
}

export default Home;
