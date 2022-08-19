import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { getSession, useSession } from "next-auth/react";
import { getSpecificPlaylist, getTracks } from "@lib/spotify";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { GameCard } from "@components/GameCard";
import { GlobalPropTypes } from "@common/constants";
import { ScoreList } from "@components/ScoreList";

const GAME_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  STARTED: "STARTED",
  FINISHED: "FINISHED",
};

const SONGS_LIMIT = 10;
const getRandomSong = (tracks, obj) => {
  const randomIndex = Math.floor(Math.random() * tracks.length);
  const track = tracks[randomIndex];
  console.debug({ randomIndex, track, tracks });
  if (obj[track.id]) {
    return getRandomSong(tracks, obj);
  }
  obj[track.id] = true;
  return track;
};

export default function Game({ playlist, tracks }) {
  const audioRef = useRef();
  const { data: session } = useSession();
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.NOT_STARTED);
  const [gameSongs, setGameSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [repeatedSongs, setRepeatedSongs] = useState({});
  const [selectedSong, setSelectedSong] = useState(null);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [score, setScore] = useState(0);

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

  const onBtnClick = () => {
    if (gameStatus === GAME_STATUS.NOT_STARTED) {
      setGameStatus(GAME_STATUS.STARTED);
    } else if (currentSongIndex < gameSongs.length - 1) {
      setCurrentSongIndex((prevSong) => prevSong + 1);
      setSelectedSong(null);
    } else {
      setGameStatus(GAME_STATUS.FINISHED);
    }
  };

  const onSongSelect = (song) => {
    if (song.id === gameSongs[currentSongIndex].id) {
      setScore((prevScore) => prevScore + 1);
    }
    setSelectedSong(song);
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
    if (gameStatus === GAME_STATUS.STARTED && gameSongs[currentSongIndex]) {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(gameSongs[currentSongIndex].preview_url);
      audioRef.current.play();
      getSongOptions(gameSongs[currentSongIndex]);
    }
  }, [gameStatus, currentSongIndex]);

  if (!playlist || !tracks) {
    return <Text>Something went wrong. Please try again later.</Text>;
  }

  if (gameStatus === GAME_STATUS.FINISHED) {
    return (
      <Container background="blackAlpha.900" color="#fff">
        <Center flexDir={"column"} height="100vh">
          <Image
            src={playlist.images[0].url}
            height={[40, 48, 56, 56]}
            mb={4}
          />
          <Box mb={8} maxW={360} textAlign="center">
            <Heading as="h2" size={"lg"}>
              {playlist.name}
            </Heading>
            <Text>{playlist.description}</Text>
          </Box>

          <Heading as="h4" fontSize={"lg"}>
            Game score:
          </Heading>
          <ScoreList playersScore={[{ name: session.user.name, score }]} />
        </Center>
      </Container>
    );
  }

  return (
    <Container background="blackAlpha.900" color="#fff">
      <Center flexDir={"column"} height="100vh" px={12}>
        <Heading as="h1" mb={8}>
          Start a new game:
        </Heading>
        <Image src={playlist.images[0].url} height={[40, 48, 56, 56]} mb={4} />

        <Box mb={8} maxW={360} textAlign="center">
          <Heading as="h2" size={"lg"}>
            {playlist.name}
          </Heading>
          <Text>{playlist.description}</Text>
        </Box>

        <Text>
          Score {score}/{SONGS_LIMIT}
        </Text>

        {gameStatus === GAME_STATUS.STARTED && (
          <SimpleGrid columns={2} spacing={2} mb={8} width="100%">
            {currentOptions.map((option) => (
              <GameCard
                key={option.id}
                isSelected={
                  selectedSong
                    ? option.id === gameSongs[currentSongIndex].id
                    : undefined
                }
                onSelect={() => !selectedSong && onSongSelect(option)}
              >
                {option.name}
              </GameCard>
            ))}
          </SimpleGrid>
        )}
        <Button disabled={!gameSongs} onClick={onBtnClick} size="lg">
          {gameStatus === GAME_STATUS.STARTED ? "Next" : "Start Game"}
        </Button>
      </Center>
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
  playlist: GlobalPropTypes.playlist.isRequired,
  tracks: PropTypes.arrayOf(GlobalPropTypes.track).isRequired,
};
