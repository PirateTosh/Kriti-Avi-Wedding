import _ from 'lodash';
const AsyncStorage = window.localStorage;

const CHAT_STORE_VERSION = '1';
const CHAT_STORE_PREFIX = 'bmt-chat-';
const CHAT_LEDGER_KEY = 'list';

const chatkey = CHAT_STORE_PREFIX + CHAT_STORE_VERSION + '-';
const ledgerKey = chatkey + CHAT_LEDGER_KEY;

const getKey = (id) => chatkey + id;

const create = () => {

  let resetUnreadCount = (userId) => {
    try {
      let listString = AsyncStorage.getItem(ledgerKey);
      let list = JSON.parse(listString);
      let overallList = list ? list : {};
      let count = 0;
      if (overallList.hasOwnProperty(userId)) {
        count = overallList[userId].count ? overallList[userId].count : 0;
        overallList[userId].count = 0;
        AsyncStorage.setItem(ledgerKey, JSON.stringify(overallList));
      }
      return count;
    }
    catch (err) {
      return 0;
    }
  };

  let getStoredUnreadCount = () => {
    try {
      let listString = AsyncStorage.getItem(ledgerKey);
      let list = JSON.parse(listString);
      let overallList = list ? list : {};
      let count = 0;
      list.forEach(s => {
        count += (s.count ? s.count : 0);
      });
      return count;
    }
    catch (err) {
      return 0;
    }
  };

  let getChatForUser = (userId) => {
    try {
      const chatListString = AsyncStorage.getItem(getKey(userId));
      const chatList = JSON.parse(chatListString);
      let unreadCount = resetUnreadCount(userId);
      return {
        unreadCount,
        chats: chatList ? chatList : []
      }
    }
    catch (error) {
      return [];
    }
  };

  let updateOverallList = (userId, name, msg, time) => {
    try {
      let listString = AsyncStorage.getItem(ledgerKey);
      let list = JSON.parse(listString);
      let overallList = list ? list : {};
      let totalCount = 0;
      if (overallList.hasOwnProperty(userId)) {
        let { count } = overallList[userId];
        totalCount = count ? count : 0;
      }
      totalCount += 1;
      overallList[userId] = { name, msg, time, count: totalCount };
      AsyncStorage.setItem(ledgerKey, JSON.stringify(overallList));
    }
    catch (err) {

    }
  };

  let addChatMessageForUser = ({ userId, msgObj }) => {
    try {
      let chatListString = AsyncStorage.getItem(getKey(userId));
      let chatList = JSON.parse(chatListString);
      let updatedList = chatList ? chatList : [];
      let alreadyContains = updatedList.find(l => {
        if (!l._id || !msgObj._id) {
          return false;
        }
        return l._id === msgObj._id
      });
      if (!alreadyContains) {
        updatedList.push(msgObj);
        AsyncStorage.setItem(getKey(userId), JSON.stringify(updatedList));
        let saveName = userId === msgObj.senderId ? msgObj.senderName : userId === msgObj.receiverId ? msgObj.receiverName : '';
        updateOverallList(userId, saveName, msgObj.message, msgObj.timestamp);
        return true;
      }
      return false;
    }
    catch (error) {
      return -1;
    }
  };

  let getOverallList = () => {
    try {
      let listString = AsyncStorage.getItem(ledgerKey);
      let list = JSON.parse(listString);
      return list ? list : {};
    }
    catch (err) {
      return {};
    }
  };


  return {
    getChatForUser,
    addChatMessageForUser,
    getOverallList,
    getStoredUnreadCount
  };
};

export default {
  create
};