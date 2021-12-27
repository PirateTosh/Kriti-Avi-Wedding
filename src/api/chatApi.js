import store from "../store";
import Meteor from "react-web-meteor";
import Tracker from 'trackr';
import {myChatAction, myChatMessagesAction, loadLocalList, loadOnlineList, receiveRequest, setCurrentChat, updateCurrentChat, changeUnreadCount, setUnreadCount } from "../actions/chat.action";
import {browserHistory} from "react-router";
import {EventId} from "../config/config";

import ChatStorage from './chatStorage.js';
import { Chat, ChatRequests, NotificationCount } from '../collections/chat.collection.js';

const localChatApi = ChatStorage.create();

let chatSub = null
let chatComputation = null;
let chatRequestComputation = null;
let notificationComputation = null;
let notificationCountSub = null;
let notificationCountComputation = null;

export const reloadCurrentChat = () => {
  let state = store.getState();
  let currentId = state.myChatReducer.currentChatId;
  if(currentId) {
    let { chats, unreadCount } = localChatApi.getChatForUser(currentId);
    store.dispatch(updateCurrentChat(chats));
    // store.dispatch(changeUnreadCount(-unreadCount))
  }
};

export function getGuestList({ eventId, guestId, flag }) {
  Meteor.call("guest.fetch.all", { eventId, guestId }, (error, result) => {
    if(error) {
      console.log(error);
    }
    else {
      store.dispatch(loadOnlineList(result));
    }
  });
}

export function unsubscribeToChat() {
  chatSub && chatSub.stop();
  chatComputation && clearInterval(chatComputation);
  chatRequestComputation && clearInterval(chatRequestComputation);
  notificationComputation && clearInterval(notificationComputation);
  notificationCountSub && notificationCountSub.stop();
  notificationCountComputation && clearInterval(notificationCountComputation);
};


export function subscribeToChat ({ eventId, guestId }) {
  unsubscribeToChat();
  chatSub = Meteor.subscribe('guest.chat', {eventId, guestId});
  notificationCountSub = Meteor.subscribe('guest.notification.count', { eventId, guestId });

  console.log(chatSub);
  // store.dispatch(setUnreadCount(localChatApi.getStoredUnreadCount()))

  notificationCountComputation = setInterval(() => {
    let notificationCount = NotificationCount.find(guestId);
    if(notificationCount && notificationCount.length > 0) {
      notificationCount = notificationCount[0].count;
      let notifCount = parseInt(localStorage.getItem("totalCount")) || 0;
      let oldNotifCount = parseInt(localStorage.getItem("notificationCount")) || 0;
      if(notifCount !== notificationCount) {
        console.log(notificationCount);
        let finalCount = notificationCount - notifCount;
        localStorage.setItem("notificationCount", oldNotifCount + finalCount);
        localStorage.setItem("totalCount", notificationCount);
      }
    }
  }, 5000);

  let notCount = 0;
  notificationComputation = setInterval(() => {
    let notifCount = parseInt(localStorage.getItem("notificationCount")) || 0;
    if(notifCount !== notCount) {
      notCount = notifCount;
      store.dispatch(setUnreadCount(notifCount));
    }
  }, 2000);
  chatComputation = setInterval(() => {
    let chats = Chat.find();
    let idList = [];
    let finalCount = 0;
    if(chats.length > 0) {
      let guestId = chats[0].receiverId;
      for(var i = 0; i < chats.length; i++) {
        let msgObj = chats[i];
        let added = localChatApi.addChatMessageForUser({ userId: msgObj.senderId, msgObj });
        idList.push(msgObj._id);

        if(added) {
          finalCount += 1;
        }
        console.log(msgObj);

        let userKey = `chat.${msgObj.senderId}`;
        let overallKey = 'overallChatCount';
        let chatCount = parseInt(localStorage.getItem(userKey)) || 0;
        let overallCount = parseInt(localStorage.getItem(overallKey)) || 0;
        localStorage.setItem(userKey, chatCount + 1);
        localStorage.setItem(overallKey, overallCount + 1);
      }
      // store.dispatch(changeUnreadCount(finalCount));
      Meteor.call('guest.receivedMessages', { guestId, idList }, (err, res) => {
        if(!err) {
          reloadCurrentChat();
        }
        else {
          console.log(err);
        }
      });
    }
  }, 5000);

  let oldCount = -1;
  chatRequestComputation = setInterval(() => {
    let requests = ChatRequests.find();
    if(requests.length > 0 && oldCount !== requests.length) {
      console.log(requests);
      oldCount = requests.length;
      store.dispatch(receiveRequest(requests));

      let requestsListKey = 'requests-list';
      let oldRequests = JSON.parse(localStorage.getItem(requestsListKey)) || [];
      let oldKeys = new Set(oldRequests.filter(req => req.senderId !== guestId).map(req => req.senderId));

      let newKeys = new Set(requests.filter(req => req.senderId !== guestId).map(req => req.senderId));

      let difference = new Set(
        [...newKeys].filter(x => !oldKeys.has(x))
      );

      console.log(oldKeys, newKeys, difference);
      let overallKey = 'overallChatCount';
      difference.forEach(res => {
        let userKey = `chat.${res}`;
        let chatCount = parseInt(localStorage.getItem(userKey)) || 0;
        let overallCount = parseInt(localStorage.getItem(overallKey)) || 0;
        localStorage.setItem(userKey, chatCount + 1);
        localStorage.setItem(overallKey, overallCount + 1);
      });

      localStorage.setItem(requestsListKey, JSON.stringify(requests));


      // let userKey = `chat.${msgObj.senderId}`;
      // let chatCount = parseInt(localStorage.getItem(userKey)) || 0;
      // localStorage.setItem(userKey, chatCount + 1);
    }
  }, 5000);
}

export function setRequest({ requestId, status }) {
  Meteor.call('guest.chat.request.update', { requestId, status }, (err, res) => {
    if(err) return;
    else {
      let requestsListKey = 'requests-list';
      let oldRequests = JSON.parse(localStorage.getItem(requestsListKey)) || [];
      let index = oldRequests.findIndex(req => req._id === requestId);
      if(index > -1) {
        oldRequests[index].status = status;
      }

      localStorage.setItem(requestsListKey, JSON.stringify(oldRequests));
      store.dispatch(receiveRequest(oldRequests));
    }
  });
}

export function sendRequest({ senderId, receiverId }) {
  console.log(senderId, receiverId);
  Meteor.call('guest.chat.request', { senderId, receiverId }, (err, res) => {
    console.log(err,res);
  });
}

export function sendMessage({ msgObj }) {
  console.log("SENDING MESSAGE");
  Meteor.call('guest.sendMessage', msgObj, (error, response) => {
    console.log(error, response);
    if(!error) {
      localChatApi.addChatMessageForUser({ userId: msgObj.receiverId, msgObj });
      reloadCurrentChat();
    }
  });
}

export function loadOverallList() {
  let list = localChatApi.getOverallList();
  store.dispatch(loadLocalList(list));
}

export function fetchGuests(eventId, guestId, flag) {
  Meteor.call("guest.fetch.all", {eventId: eventId, guestId:guestId}, function (error, result) {
    console.log("HAFAF PAFP APF APSHF ");
    console.log(result);
        if (error) {
            console.log(error);
        } else {
            //console.log("My Chat List");
            //console.log(result);
            store.dispatch(myChatAction(result));
            if (!flag) {
                browserHistory.push("/chat");
            }
        }
    });
}
export function fetchGuestChatList(guestId) {
    Meteor.call("guest.chat", {guestId:guestId}, function(error, response){
        if(error) {
            console.log(error);
        }
        else {
          console.log('Chat Details List',response);
          store.dispatch(myChatMessagesAction(response));
        }
      });
}
