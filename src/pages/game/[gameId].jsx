import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { getSession } from "next-auth/react";
import { getSpecificPlaylist, getTracks } from "@lib/spotify";
import { Button, Container, Heading, Text } from "@chakra-ui/react";

export default function Game({ playlist, tracks }) {
  const audioRef = useRef();
  const [currentSong] = useState(0);

  const startMusic = () => {
    audioRef.current = new Audio(tracks[currentSong].track.preview_url);
    audioRef.current.play();
  };

  if (!playlist || !tracks) {
    return <Text>Something went wrong. Please try again later.</Text>;
  }

  return (
    <Container>
      <Heading as="h2">{playlist.name}</Heading>
      <Button onClick={startMusic}>Start</Button>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const { playlistId } = context.query;
  const session = await getSession({ req: context.req });

  const playlist = await getSpecificPlaylist(session?.refreshToken, playlistId);
  const tracksTotal = playlist.tracks.total - 10; // in case we get the max value in the randomizer
  const tracksOffset = Math.floor(Math.random() * (tracksTotal + 1));

  const tracks = await getTracks(
    session?.refreshToken,
    playlistId,
    tracksOffset
  );

  return {
    props: { playlist, tracks },
  };
}

Game.propTypes = {
  playlist: PropTypes.any,
  tracks: PropTypes.any,
};
