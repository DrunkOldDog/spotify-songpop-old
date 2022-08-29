import { Flex, Text } from "@chakra-ui/react";
import { GlobalPropTypes } from "@common/constants";
import { NavigationBar } from "../Navbar";

export const GameNavbar = ({ player }) => {
  return (
    <NavigationBar fontWeight={"bold"} fontSize={20}>
      <Text fontWeight={"bold"} fontSize={20}>
        {player.userName}
      </Text>
      <Flex gap={"2px"}>
        <Text>{player.score}</Text>
        <Text>/</Text>
        <Text opacity={0.6}>10</Text>
      </Flex>
    </NavigationBar>
  );
};

GameNavbar.propTypes = {
  player: GlobalPropTypes.player,
};
