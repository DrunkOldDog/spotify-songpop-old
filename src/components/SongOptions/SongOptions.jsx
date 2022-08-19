import PropTypes from "prop-types";
import { SimpleGrid } from "@chakra-ui/react";
import { GameCard } from "@components/GameCard";
import { GlobalPropTypes } from "@common/constants";

export const SongOptions = ({
  songOptions,
  currentSong,
  isSongSelected,
  onSongSelect,
}) => {
  return (
    <SimpleGrid columns={2} spacing={2} mb={8} width="100%">
      {songOptions.map((song) => (
        <GameCard
          key={song.id}
          isSelected={isSongSelected ? song.id === currentSong.id : undefined}
          onSelect={() => !isSongSelected && onSongSelect?.(song)}
        >
          {song.name}
        </GameCard>
      ))}
    </SimpleGrid>
  );
};

SongOptions.propTypes = {
  songOptions: PropTypes.arrayOf(GlobalPropTypes.track).isRequired,
  currentSong: GlobalPropTypes.track.isRequired,
  isSongSelected: PropTypes.bool,
  onSongSelect: PropTypes.func,
};
