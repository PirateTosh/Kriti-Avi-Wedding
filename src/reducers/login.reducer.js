import * as actions from "../actions/actionTypes";

const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.LOGIN_DETAILS:
      {
        return {
          ...state,
          guestDetails: action.guestDetails,
          EventName: action.EventName
        };
      }
    default:
      return state;
  }
};

export default loginReducer;