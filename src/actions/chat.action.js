import { GET_CHAT_GUEST_DETAILS, GET_CHAT_GUEST_MESSAGES, LOAD_LOCAL_LIST, LOAD_ONLINE_LIST, RECEIVE_REQUEST, SET_CURRENT_CHAT, UPDATE_CURRENT_CHAT, CHANGE_UNREAD_COUNT, SET_UNREAD_COUNT } from "./actionTypes";

export function myChatAction(apiResponse) {
  //console.log('apires',apiResponse);
  return {
    type: GET_CHAT_GUEST_DETAILS,
    chatScreenReducer: apiResponse
  }
}

export function myChatMessagesAction(apiResponse) {
  //console.log('apires',apiResponse);
  return {
    type: GET_CHAT_GUEST_MESSAGES,
    chatScreenReducer: apiResponse
  }
}

export function updateCurrentChat(messages) {
  return {
    type: UPDATE_CURRENT_CHAT,
    messages
  }
}

export function loadLocalList(list) {
  return {
    type: LOAD_LOCAL_LIST,
    list
  }
}

export function loadOnlineList(list) {
  return {
    type: LOAD_ONLINE_LIST,
    list
  }
}

export function receiveRequest(requests) {
  return {
    type: RECEIVE_REQUEST,
    requests
  }
}

export function setCurrentChat(senderId) {
  return {
    type: SET_CURRENT_CHAT,
    senderId
  }
}

export function changeUnreadCount(change) {
  return {
    type: CHANGE_UNREAD_COUNT,
    change
  }
}

export function setUnreadCount(count) {
  return {
    type: SET_UNREAD_COUNT,
    count
  }
}