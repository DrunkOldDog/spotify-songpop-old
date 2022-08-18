import PropTypes from "prop-types";
import { Center, Text } from "@chakra-ui/react";

export const GameCard = ({ children, isSelected, onSelect }) => {
  return (
    <Center
      fontWeight={"semibold"}
      borderWidth={2}
      borderRadius={"md"}
      height={20}
      cursor="pointer"
      color={"white"}
      backgroundColor={
        isSelected !== undefined
          ? isSelected
            ? "green.400"
            : "red.500"
          : "gray.700"
      }
      textAlign="center"
      userSelect={"none"}
      p={4}
      _hover={
        isSelected === undefined ? { backgroundColor: "gray.800" } : undefined
      }
      onClick={onSelect}
    >
      <Text noOfLines={2}>{children}</Text>
    </Center>
  );
};

GameCard.propTypes = {
  onSelect: PropTypes.func,
  isSelected: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
