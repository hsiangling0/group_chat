import { Flex } from "@chakra-ui/layout";
import { SearchIcon } from "@chakra-ui/icons";
import addIcon from "../Icon/add.svg";
import { useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Image,
  Button,
  Avatar,
  Text,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { searchUser, createChat } from "../Utilities/api";
export default function Search(props) {
  var account1 = JSON.parse(sessionStorage.getItem("account"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchResult, setSearchR] = useState([]);
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      onOpen();
      searchUser(account1, values.name).then((res) => {
        setSearchR(res.response);
      });
    },
  });
  const addFriend = (e) => {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    createChat(e.friendID, account1, timestamp)
      .then((chat) => {
        props.getChang({
          roomID: chat.roomID,
          friendName: e.friendName,
        });
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Flex bgColor="#EBEBE9" borderRadius="30px" h="75px" alignItems="center">
      <form
        onSubmit={formik.handleSubmit}
        style={{ width: "85%", marginLeft: "5%" }}
      >
        <Flex w="100%">
          <FormControl>
            <Flex alignItems="center" h="40px" border="#ADADAD solid 1px" bgColor="white" borderRadius="10px" mr="10px" color="#ADADAD">
              <SearchIcon
                  color="#ADADAD"
                  boxSize="20px"
                  ml="20px"
                />
              <Input
                w="250px"
                h="90%"
                name="name"
                placeholder="search for the user name..."
                onChange={formik.handleChange}
                value={formik.values.name}
                border="none"
                focusBorderColor="#ffffff"
              />
            </Flex>
          </FormControl>
          <button type="submit">
            <Image src={addIcon} />
          </button>
        </Flex>
      </form>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        {searchResult ? (
          <ModalContent mt="30vh">
            <ModalHeader>Choose your friends</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {searchResult.map((e, index) => (
                <Flex
                  alignItems="center"
                  key={index}
                  onClick={() => addFriend(e)}
                  cursor="pointer"
                  mb="10px"
                  mt="5px"
                >
                  <Avatar name={e.friendName}></Avatar>
                  <Text ml="2vw" fontSize="16px">
                    {e.friendName}
                  </Text>
                </Flex>
              ))}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        ) : (
          <ModalContent>
            <ModalHeader>Sorry, we can't find it...</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Please check out your input, and search it again!
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </Flex>
  );
}
