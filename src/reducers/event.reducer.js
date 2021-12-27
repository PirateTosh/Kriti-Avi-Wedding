import * as actions from "../actions/actionTypes";
import { GET_EVENT_DETAILS, SET_EVENT_PREFERENCE } from "../actions/actionTypes";

const eventReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.GET_EVENT_DETAILS: {
      return {
        ...state,
        eventDetails: action.eventScreenReducer
      };
    }
    default: {
      return state;
    }
  }
};

export default eventReducer;