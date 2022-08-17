import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { getSession } from "next-auth/react";
import { getSpecificPlaylist, getTracks } from "@lib/spotify";
import { Button, Container, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { GameCard } from "@components/GameCard";

const SONGS_LIMIT = 10;
const getRandomSong = (tracks, obj) => {
  const randomIndex = Math.floor(Math.random() * (tracks.length + 1));
  const track = tracks[randomIndex];
  if (obj[track.id]) {
    return getRandomSong(tracks, obj);
  }
  obj[track.id] = true;
  return track;
};

export default function Game({ playlist, tracks }) {
  const audioRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [gameSongs, setGameSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [repeatedSongs, setRepeatedSongs] = useState({});
  const [selectedSong, setSelectedSong] = useState(null);
  const [currentOptions, setCurrentOptions] = useState([]);

  useEffect(() => {
    if (tracks.length) {
      const randomSongs = [],
        songsObj = {};
      const songsScope =
        SONGS_LIMIT < tracks.length ? SONGS_LIMIT : tracks.length;
      for (let i = 0; i < songsScope; i++) {
        randomSongs[i] = getRandomSong(tracks, songsObj);
      }

      setGameSongs(randomSongs);
    }
  }, [tracks]);

  const startGame = () => {
    if (!playing) setPlaying(true);
    else {
      setCurrentSongIndex((prevSong) => prevSong + 1);
      setSelectedSong(null);
    }
  };

  const getSongOptions = (currentTrack) => {
    const currentTrackPos = Math.floor(Math.random() * 4);
    const options = [];
    const currentIds = { ...repeatedSongs, [currentTrack.id]: true };
    for (let i = 0; i < 4; i++) {
      if (currentTrackPos === i) {
        options[i] = currentTrack;
      } else {
        const randomSong = getRandomSong(tracks, currentIds);
        options[i] = randomSong;
      }
    }

    setRepeatedSongs(currentIds);
    setCurrentOptions(options);
  };

  useEffect(() => {
    if (playing && gameSongs[currentSongIndex]) {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(gameSongs[currentSongIndex].preview_url);
      audioRef.current.play();
      getSongOptions(gameSongs[currentSongIndex]);
    }
  }, [playing, currentSongIndex]);

  if (!playlist || !tracks) {
    return <Text>Something went wrong. Please try again later.</Text>;
  }

  return (
    <Container>
      <Heading as="h2">{playlist.name}</Heading>
      {playing && (
        <SimpleGrid columns={2} spacing={2}>
          {currentOptions.map((option) => (
            <GameCard
              key={option.id}
              isSelected={
                selectedSong
                  ? option.id === gameSongs[currentSongIndex].id
                  : undefined
              }
              onSelect={() => setSelectedSong(option)}
            >
              {option.name}
            </GameCard>
          ))}
        </SimpleGrid>
      )}
      <Button disabled={!gameSongs} onClick={startGame}>
        {playing ? "Next" : "Start Game"}
      </Button>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const { playlistId } = context.query;
  const session = await getSession({ req: context.req });

  const playlist = await getSpecificPlaylist(session?.refreshToken, playlistId);
  /* Add validation to at least play with 40 songs */
  const tracksTotal = playlist.tracks.total - 40;
  const tracksOffset =
    playlist.tracks.total > 40
      ? Math.floor(Math.random() * (tracksTotal + 1))
      : 0;

  const tracks = await getTracks(
    session?.refreshToken,
    playlistId,
    tracksOffset
  );

  return {
    props: { playlist, tracks: tracks.map(({ track }) => track) },
  };
}

Game.propTypes = {
  playlist: PropTypes.any,
  tracks: PropTypes.any,
};
