import { LastMessage } from "../Utilities/lastMessage";
import { unreadNotification } from "../Utilities/unreadNotificaiton";
import React from "react";
import { Flex, Stack } from "@chakra-ui/layout";
import { Avatar, Text, Divider } from "@chakra-ui/react";
import moment from "moment";
export default function FriendList(props) {
  //var name1 = JSON.parse(sessionStorage.getItem("name"));
  var account1 = JSON.parse(sessionStorage.getItem("account"));
  const all_notification = unreadNotification(props.notification);
  const notification_num = all_notification?.filter(
    (n) => n.sender == props.receiver.friendName
  );

  const { lastMessage } = LastMessage(
    props.receiver.roomID,
    account1,
    props.notification,
    props.message
  );
  return (
    <Stack
      cursor="pointer"
      onClick={() => props.updateChat(props.receiver, notification_num)}
    >
      <Flex alignItems="center" w="100%">
        {props.receiver.photo?<img style={{width:"48px",height:"48px",borderRadius: "100px",objectFit:"cover"}}src={props.receiver.photo}></img>:<Avatar name={props.receiver.friendName}></Avatar>}
        <Stack ml="20px" flexGrow="1">
          <Flex justifyContent="space-between">
            <Text fontSize="16px">{props.receiver.friendName}</Text>
            {lastMessage && (
              <Text fontSize="12px" color="#ADADAD">
                {moment(JSON.parse(lastMessage.date)).calendar(moment(), {})}
              </Text>
            )}
          </Flex>
          <Flex justifyContent="space-between">
            {lastMessage && (
              <Text color="#ADADAD" fontSize="14px">
                {lastMessage.text}
              </Text>
            )}
            {notification_num?.length > 0 ? (
              <Flex
                bgColor="#FFB6B5"
                height="25px"
                minW="25px"
                borderRadius="50%"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="17px"
              >
                {notification_num?.length}
              </Flex>
            ) : (
              <Flex height="20px" width="20px" />
            )}
          </Flex>
        </Stack>
      </Flex>
      <Divider />
    </Stack>
  );
}
//const FriendList = React.memo(props)=>{}
//export default React.memo(FriendList);
