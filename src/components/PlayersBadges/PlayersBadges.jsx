import PropTypes from "prop-types";
import { Text, Wrap, WrapItem } from "@chakra-ui/react";

export const PlayersBadges = ({ playersList, ...styleProps }) => {
  return (
    <Wrap {...styleProps}>
      {playersList?.map((user) => (
        <WrapItem
          key={user.id}
          background="rgba(255, 255, 255, 0.25)"
          px={2}
          py={1}
          borderRadius={1000}
        >
          <Text fontWeight={"bold"}>{user.userName}</Text>
        </WrapItem>
      ))}
    </Wrap>
  );
};

PlayersBadges.propTypes = {
  playersList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      userName: PropTypes.string,
      score: PropTypes.number,
    })
  ),
};
