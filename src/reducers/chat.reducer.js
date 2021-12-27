import * as actions from "../actions/actionTypes";
import { GET_CHAT_GUEST_DETAILS } from "../actions/actionTypes";

const myChatReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.GET_CHAT_GUEST_DETAILS:
      {
        return {
          ...state,
          chatGuests: action.chatScreenReducer
        };
      }
      break;
    case actions.GET_CHAT_GUEST_MESSAGES:
      {
        console.log("chat message screen");
        return {
          ...state,
          chatMessages: action.chatScreenReducer
        };
      }
      break;
    case actions.LOAD_LOCAL_LIST:
      return {
        ...state,
        chatList: action.list
      }
    case actions.LOAD_ONLINE_LIST:
      return {
        ...state,
        onlineList: action.list
      }
    case actions.RECEIVE_REQUEST:
      return {
        ...state,
        requests: action.requests
      }
    case actions.SET_CURRENT_CHAT:
      return {
        ...state,
        currentChatId: action.senderId
      }
    case actions.UPDATE_CURRENT_CHAT:
      return {
        ...state,
        currentMessages: action.messages
      }

    case actions.CHANGE_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: state.unreadCount + action.change
      }
    case actions.SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.count
      }
    default:
      return state;
  }
};

export default myChatReducer;