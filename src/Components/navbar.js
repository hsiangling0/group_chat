import React, { useState, useEffect } from "react";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import header from "../Icon/header.svg";

export default function Navbar(props) {
  const [scrolled, setScrolled] = useState(window.scrollY > 0);
  const navHeight = "75px";
  const handleScroll = () => setScrolled(window.scrollY > 0);
  const navigate = useNavigate();
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
    <Box w="100vw" h="100vh" bgColor="rgba(234, 216, 202,0.26)">
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
        bgImg={header}
        bgColor="rgba(234, 216, 202,0.26)"
        bgSize="cover"
        borderRadius="20px"
      >
        <Text fontSize="40px" color="white" fontWeight="bolder" ml={15}>
          The Cloud
        </Text>
        <Flex mr="25px" alignItems="center">
          <Link to="https://emotional-context-web-grccxmtmma-uc.a.run.app">
            <Text color="white" fontWeight="bold">
              About us
            </Text>
          </Link>
          <Button
            ml="40px"
            variant="unstyled"
            background="none"
            color="white"
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
