import { useEffect, useState } from "react";

export const SONGS_LIMIT = 10;
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

export const useCreateGame = (tracks) => {
  const [gameSongs, setGameSongs] = useState([]);
  const [repeatedSongs, setRepeatedSongs] = useState({});
  const [currentSongOptions, setCurrentSongOptions] = useState([]);

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
    setCurrentSongOptions(options);
  };

  return { gameSongs, currentSongOptions, getSongOptions };
};
