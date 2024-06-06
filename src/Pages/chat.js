import { Flex, Stack } from "@chakra-ui/layout";
import { Button, Input, Spinner } from "@chakra-ui/react";
import withAuth from "../Utilities/withAuth";
import Search from "../Components/search";
import FriendList from "../Components/friendlist";
import Analysis from "../Components/analysis";
import {
  chatList,
  getMessage,
  sendMessage,
  reviseMessage,
} from "../Utilities/api";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Avatar,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Image,
} from "@chakra-ui/react";
import moment from "moment";
import "react-day-picker/dist/style.css";
// import InputEmoji from "react-input-emoji";
// import send from "../Icon/send.svg";
import tab_bg from "../Icon/tab.png";
import chat_bg from "../Icon/bg.svg";
import { io } from "socket.io-client";
export default function Chat() {
  const socket = useRef();
  const scrollRef = useRef();
  const [userList, setList] = useState([]);
  const [currentChat, setCurrent] = useState([]);
  const [receiverName, setReceiverName] = useState("");
  const [chatroom, setChatRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [revise, setRevise] = useState(false);
  const [reText, setRetext] = useState({ text: "", p: 0 });
  // const [percentage, setPercentage] = useState(0);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState([]);
  var name1 = JSON.parse(sessionStorage.getItem("name"));
  var account1 = JSON.parse(sessionStorage.getItem("account"));
  // socket name1
  useEffect(() => {
    if (name1) {
      socket.current = io("http://luffy.ee.ncku.edu.tw:5844");
      socket.current.emit("addUser", name1, account1);
    }
    return () => {
      socket.current?.disconnect();
    };
  }, []);
  //send message
  useEffect(() => {
    socket.current.emit("sendMessage", { ...message, receiverName, name1 });
  }, [message]);

  //receive message and notification
  useEffect(() => {
    socket.current.on("getMessage", (res) => {
      console.log(res);
      if (chatroom != res.chatId) return;
      setCurrent((prev) => [...prev, res]);
    });
    socket.current.on("getNotification", (res) => {
      const chatOpen = receiverName == res.sender;
      if (chatOpen) {
        setNotification((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotification((prev) => [res, ...prev]);
      }
    });
    return () => {
      socket.current.off("getMessage");
      socket.current.off("getNotification");
    };
  }, [chatroom]);

  //scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat]);
  useEffect(() => {
    setList([]);
    if (account1) {
      chatList(account1)
        .then((res) => {
          if (res.remark == "No friend exist") {
            setList([]);
          } else {
            console.log(res.response);
            setList(res.response);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const updateChat = (receiver, thisNotification) => {
    console.log(receiver);
    getMessage(receiver.roomID, account1)
      .then((res) => {
        if (res == "No message yet") {
          setCurrent([]);
        } else {
          setCurrent(res.response);
        }
        setChatRoom(receiver.roomID);
        setReceiverName(receiver.friendName);
      })
      .catch((err) => {
        console.log(err);
      });
    if (thisNotification?.length > 0) {
      resetNotification(thisNotification, notification);
    }
  };
  const sendText = (t, p) => {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    sendMessage(chatroom, account1, text, t, p, timestamp)
      .then((res) => {
        var send = {
          chatId: chatroom,
          senderId: account1,
          text: t,
          score: p,
          date: timestamp,
        };
        setCurrent((prev) => [...prev, send]);
        setMessage(send);
        // setPercentage(p);
        setText("");
        setRevise(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const reviseText = (t) => {
    setRevise(true);
    setLoading(true);
    reviseMessage(account1, t)
      .then((res) => {
        setRetext({ text: res.modifiedMessage, p: res.score });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const resetNotification = useCallback((thisNotification, allNotification) => {
    const newNotification = allNotification.map((e) => {
      let notification;
      thisNotification.forEach((n) => {
        if (n.sender == e.sender) {
          notification = { ...n, isRead: true };
        } else {
          notification = e;
        }
      });
      return notification;
    });
    setNotification(newNotification);
  }, []);

  const Message = (props) => (
    <Flex
      ref={scrollRef}
      flexDir={props.message.senderId == account1 ? "row-reverse" : "row"}
      alignItems="flex-end"
      mt="10px"
    >
      <Text
        bgColor={props.message.senderId == account1 ? "#FFB6B5" : "#F0F1F5"}
        maxW="40%"
        p="8px"
        borderRadius="10px"
      >
        {props.message.text}
      </Text>
      <Stack
        alignItems={
          props.message.senderId == account1 ? "flex-end" : "flex-start"
        }
        gap="0px"
      >
        <Text mr="5px" ml="5px" fontSize="13px" fontWeight="bolder">
          {props.message.score}%
        </Text>
        <Text mr="5px" ml="5px" color="#ADADAD" fontSize="12px">
          {moment(JSON.parse(props.message.date)).calendar(moment(), {})}
        </Text>
      </Stack>
    </Flex>
  );

  return withAuth(
    <Flex h="100%" w="100vw">
      <Stack w="450px" p="15px" h="100%" pb="10px">
        <Search getChang={(friend) => setList((pre) => [...pre, friend])} />
        <Stack
          bgColor="white"
          borderRadius="50px"
          mt="5px"
          height="calc(100vh - 203px)"
          p="25px"
          overflowY="scroll"
        >
          {userList &&
            userList.map((user, index) => (
              <FriendList
                key={index}
                receiver={user}
                notification={notification}
                message={message}
                updateChat={(re, n) => updateChat(re, n)}
              />
            ))}
        </Stack>
      </Stack>
      {receiverName && (
        <Stack w="calc(100vw - 470px)" pt="15px" h="100%">
          <Tabs>
            <TabList
              bgImg={tab_bg}
              borderRadius="30px"
              bgSize="cover"
              h="75px"
              alignItems="center"
              border="0px"
            >
              <Flex flexGrow="1" ml="20px" alignItems="center">
                <Avatar name={receiverName} boxSize="40px"></Avatar>
                <Text ml="10px">{receiverName}</Text>
              </Flex>

              <Tab _selected={{ color: "#FFB6B5" }}>Chat</Tab>
              <Tab _selected={{ color: "#FFB6B5" }}>Into The Cloud</Tab>
            </TabList>
            <TabPanels
              mt="13px"
              bgColor="white"
              borderRadius="50px"
              height="calc(100vh - 201px)"
              bgImg={chat_bg}
              bgSize="cover"
            >
              <TabPanel
                h="100%"
                bgColor="rgba(255, 255, 255,0.7)"
                borderRadius="50px"
              >
                <Stack h="100%" justifyContent="space-between">
                  <Stack
                    h={revise ? "70%" : "76%"}
                    overflowY="scroll"
                    mt="30px"
                  >
                    {currentChat &&
                      currentChat.map((message, index) => (
                        <Message key={index} message={message} />
                      ))}
                  </Stack>
                  {revise && (
                    <Flex
                      h="90px"
                      ml="7px"
                      position="absolute"
                      bottom="16px"
                      w="calc(100vw - 509px)"
                    >
                      <Flex
                        // w="793px"
                        // h="90px"
                        // ml="7px"
                        flexGrow="1"
                        mr="10px"
                        bgColor="#F0F1F5"
                        borderRadius="20px"
                        // position="absolute"
                        // bottom="16px"
                      >
                        {loading ? (
                          <Spinner
                            m="auto"
                            mb="55px"
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="#140933"
                            size="md"
                          />
                        ) : (
                          <Flex
                            h="45px"
                            w="100%"
                            pr="16px"
                            pl="16px"
                            justifyContent="space-between"
                            alignItems="center"
                            overflow="scroll"
                            // onClick={() => sendText(reText.text, reText.p)}
                            // cursor="pointer"
                          >
                            <Text>{reText.text}</Text>
                            <Text>{reText.p}%</Text>
                          </Flex>
                        )}
                      </Flex>
                      <Button
                        mt="6px"
                        width="calc(10vw + 10px)"
                        height="32px"
                        fontSize="14px"
                        bgColor="#F0F1F5"
                        onClick={() => sendText(reText.text, reText.p)}
                        cursor="pointer"
                      >
                        SEND
                      </Button>
                    </Flex>
                  )}
                  <Flex alignItems="center">
                    <Input
                      bgColor="white"
                      borderRadius="20px"
                      w="793px"
                      h="45px"
                      ml="7px"
                      mr="10px"
                      overflow="scroll"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type a message"
                    />
                    <Button
                      width="5vw"
                      height="32px"
                      fontSize="14px"
                      mr="10px"
                      onClick={() => reviseText(text)}
                      bgColor="white"
                    >
                      <Text>REVISE</Text>
                    </Button>
                    <Button
                      width="5vw"
                      height="32px"
                      fontSize="14px"
                      bgColor="white"
                      onClick={() => sendText(text, 0)}
                    >
                      <Text>SEND</Text>
                      {/* <Image src={send} /> */}
                    </Button>
                  </Flex>
                </Stack>
              </TabPanel>
              <TabPanel
                h="100%"
                bgColor="rgba(255, 255, 255,0.7)"
                borderRadius="50px"
              >
                <Analysis
                  chat={currentChat}
                  chatID={chatroom}
                  userID={account1}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      )}
    </Flex>
  );
}
