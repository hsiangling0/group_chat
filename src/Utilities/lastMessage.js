import { useEffect, useState } from "react";
import { getMessage } from "./api";

export const LastMessage = (chatID, account, notification, message) => {
  const [lastMessage, setLastMessage] = useState("");
  useEffect(() => {
    getMessage(chatID, account).then((res) => {
      if (res == "No message yet") {
        setLastMessage("");
      } else {
        const lastMsg = res.response[res.response?.length - 1];
        setLastMessage(lastMsg);
      }
    });
  }, [message, notification]);
  return { lastMessage };
};
