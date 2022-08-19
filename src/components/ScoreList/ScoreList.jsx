import PropTypes from "prop-types";
import { Box, List, ListItem, Text } from "@chakra-ui/react";

export const ScoreList = ({ playersScore }) => {
  return (
    <List width="100%" borderWidth={2} borderRadius={"lg"} overflow="hidden">
      {playersScore.map((player, index) => (
        <ListItem
          key={`${player.name}-${index}`}
          display={"flex"}
          justifyContent="space-between"
          background="gray.800"
          px={8}
          py={4}
          fontWeight="bold"
        >
          <Box display={"flex"} gap={4}>
            <Text>{++index}.</Text>
            <Text>{player.name}</Text>
          </Box>

          <Text>{player.score}</Text>
        </ListItem>
      ))}
    </List>
  );
};

ScoreList.propTypes = {
  playersScore: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
    })
  ).isRequired,
};
