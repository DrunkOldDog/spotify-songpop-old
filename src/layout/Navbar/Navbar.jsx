import styled from "@emotion/styled";
import { Box, Button, Container, Flex } from "@chakra-ui/react";
import { Spotify } from "@assets/icons";
import { User } from "./User";
import { GlobalPropTypes } from "@common/constants";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

export const Navbar = ({ user, signIn, signOut }) => {
  const { push } = useRouter();

  return (
    <NavigationBar>
      <Box cursor={"pointer"} onClick={() => push("/")}>
        <Spotify fill="#fff" height={{ base: "26px", lg: "40px" }} />
      </Box>
      {!user ? (
        <Button
          size={{ base: "sm", lg: "md" }}
          onClick={() => signIn("spotify")}
        >
          Log In
        </Button>
      ) : (
        <User user={user} onLogout={signOut} />
      )}
    </NavigationBar>
  );
};

export const NavigationBar = ({ children, ...props }) => (
  <StlyledBar height={{ base: "54px", lg: "80px" }} {...props}>
    <Container height={"100%"}>
      <Flex justifyContent={"space-between"} alignItems="center" height="100%">
        {children}
      </Flex>
    </Container>
  </StlyledBar>
);

const StlyledBar = styled(Box)`
  background-color: #000;
`;

StlyledBar.defaultProps = {
  as: "nav",
};

NavigationBar.propTypes = {
  children: PropTypes.node,
};

Navbar.propTypes = {
  user: GlobalPropTypes.user,
  signIn: PropTypes.func,
  signOut: PropTypes.func,
};
