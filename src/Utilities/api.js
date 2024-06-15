import { customFetch } from "./customerFetch";
export const userLogin = (account, pwd) =>
  customFetch("/users/login", "POST", false, {
    userID: account,
    password: pwd,
  });
export const userRegister = (account, name, pwd) =>
  customFetch("/users/register", "POST", false, {
    userName: name,
    userID: account,
    password: pwd,
  });
export const searchUser = (account, friendName) =>
  customFetch("/chat/search", "POST", true, {
    userID: account,
    friendName: friendName,
  });
export const findID = (userid) =>
  customFetch("/users/find", "POST", false, {
    userID: userid,
  });

// export const createChat = (id1, id2) =>
//   customFetch("/chat/create", "POST", false, {
//     firstID: id1,
//     secondID: id2,
//   });
export const createChat = (friendID, account, time) =>
  customFetch("/chat/create", "POST", true, {
    friendID: friendID,
    userID: account,
    time: time,
  });
export const chatList = (account) =>
  customFetch("/chat/list", "POST", true, {
    userID: account,
  });
export const getMessage = (id, account) =>
  customFetch("/message/get", "POST", true, {
    chatID: id,
    userID: account,
  });
export const reviseMessage = (account, text) =>
  customFetch("/message/modify", "POST", true, {
    text: text,
    userID: account,
  });

export const sendMessage = (id, account, orgText, revText, score, time) =>
  customFetch("/message/send", "POST", true, {
    chatID: id,
    userID: account,
    originText: orgText,
    modifyText: revText,
    score: score,
    time: time,
  });

export const chatStartTime = (account, id) =>
  customFetch("/startTime/get", "POST", true, {
    chatID: id,
    userID: account,
  });

export const chatAnalysis = (account, id, timeStart, timeEnd) =>
  customFetch("/analyze/get", "POST", true, {
    chatID: id,
    userID: account,
    timeStart: timeStart,
    timeEnd: timeEnd,
  });

export const profileSet = (account,name,photo) =>
  customFetch("/photo/set", "POST", true, {
    userID:account,
    userName:name
  },{photo:photo});
export const profileGet = (account) =>
  customFetch("/photo/get", "POST", true, {
    userID: account,
  });