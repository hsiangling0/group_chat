import React, { useState, useEffect } from "react";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
// import header from "../Icon/header.svg";

export default function Navbar(props) {
  const [scrolled, setScrolled] = useState(window.scrollY > 0);
  const navHeight = "75px";
  const handleScroll = () => setScrolled(window.scrollY > 0);
  const navigate = useNavigate();
  var currentPage = window.location.href;
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  function logout() {
    sessionStorage.clear();
    navigate("/");
  }
  return (
    <Box w="100vw" h="100vh" bgColor="black">
      <Flex
        h={navHeight}
        w="98vw"
        px="28px"
        py="12px"
        align="center"
        justify="space-between"
        position="sticky"
        top="13px"
        left="1vw"
        boxShadow={scrolled ? "0px 5px 10px rgba(0, 0, 0, 0.05)" : "none"}
        bgColor="#EBEBE9"
        borderRadius="20px"
      >
        <Text fontSize="40px" color="blck" fontWeight="900" ml={15} fontFamily="Abril Fatface">
          The Filter
        </Text>
        <Flex mr="25px" alignItems="center" fontFamily="Abhaya Libre">
          {currentPage.endsWith('chat')?<Link to="/profile">
            Profile
          </Link>:<Link to="/chat">
            Chat
          </Link>}
          <Flex mr="40px"></Flex>
          <Link to="http://luffy.ee.ncku.edu.tw:3001">
           About us
          </Link>
          <Button
            ml="40px"
            variant="unstyled"
            background="none"
            color="black"
            fontWeight="regular"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </Flex>
      </Flex>
      <Flex
        mt="8px"
        height="calc(100vh - 87px)"
        overflowY="none"
        overflowX="hidden"
        w="100%"
      >
        {props.children}
      </Flex>
    </Box>
  );
}
