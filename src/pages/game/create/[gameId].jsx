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
  Text,
} from "@chakra-ui/react";
import { GAME_STATUS, GlobalPropTypes } from "@common/constants";
import { ScoreList } from "@components/ScoreList";
import { SongOptions } from "@components/SongOptions";
import { SONGS_LIMIT, useCreateGame } from "@hooks/useCreateGame";
import {
  SOCKET_CLIENT_MESSAGES,
  SOCKET_SERVER_MESSAGES,
} from "@common/sockets";
import { useSocket } from "@hooks/useSocket";
import { PlayersBadges } from "@components/PlayersBadges";

export default function CreateGame({ playlist, tracks }) {
  const audioRef = useRef();
  const socket = useSocket();
  const { gameSongs, currentSongOptions, getSongOptions } =
    useCreateGame(tracks);
  const { data: session, status } = useSession();
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.NOT_STARTED);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [selectedSong, setSelectedSong] = useState(null);
  const [score, setScore] = useState(0);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const onUserRoomStatus = ({ playersList }) => {
      setUsersList(playersList);
    };

    socket.on(SOCKET_CLIENT_MESSAGES.USER_JOIN, onUserRoomStatus);
    socket.on(SOCKET_CLIENT_MESSAGES.USER_DISCONNECT, onUserRoomStatus);

    return () => {
      socket.off(SOCKET_CLIENT_MESSAGES.USER_JOIN, onUserRoomStatus);
      socket.off(SOCKET_CLIENT_MESSAGES.USER_DISCONNECT, onUserRoomStatus);
    };
  }, [socket]);

  useEffect(() => {
    if (status === "loading" || !socket) return;
    socket.emit(SOCKET_SERVER_MESSAGES.NEW_GAME_CREATED, {
      hostName: session.user.name,
    });
  }, [status, socket]);

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

        {gameStatus === GAME_STATUS.NOT_STARTED ? (
          <PlayersBadges mb={6} playersList={usersList} />
        ) : (
          <Text>
            Score {score}/{SONGS_LIMIT}
          </Text>
        )}

        {gameStatus === GAME_STATUS.STARTED && (
          <SongOptions
            songOptions={currentSongOptions}
            isSongSelected={!!selectedSong}
            currentSong={gameSongs[currentSongIndex]}
            onSongSelect={onSongSelect}
          />
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

CreateGame.propTypes = {
  playlist: GlobalPropTypes.playlist.isRequired,
  tracks: PropTypes.arrayOf(GlobalPropTypes.track).isRequired,
};
