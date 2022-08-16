import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { getSession } from "next-auth/react";
import { getArtist, getArtistTopSongs } from "@lib/spotify";
import { Button, Container, Heading, Text } from "@chakra-ui/react";

export default function Game({ artist, artistTopTracks }) {
  const audioRef = useRef();
  const [currentSong, setCurrentSong] = useState(0);

  const startMusic = () => {
    audioRef.current = new Audio(artistTopTracks[currentSong].preview_url);
    audioRef.current.play();
  };

  if (!artist || !artistTopTracks) {
    return <Text>Something went wrong. Please try again later.</Text>;
  }

  return (
    <Container>
      <Heading as="h2">{artist.name}</Heading>
      <Button onClick={startMusic}>Start</Button>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const { artistId } = context.query;
  const session = await getSession({ req: context.req });

  const artist = await getArtist(session?.refreshToken, artistId);
  const artistTopTracks = await getArtistTopSongs(
    session?.refreshToken,
    artistId
  );

  return {
    props: { artist, artistTopTracks },
  };
}

Game.propTypes = {
  artist: PropTypes.any,
  artistTopTracks: PropTypes.any,
};
