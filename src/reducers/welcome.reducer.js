import * as actions from "../actions/actionTypes";

const welcomeReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.GET_WELCOME_DETAILS:
      {
        return {
          ...state,
          welcomeScreenDetails: action.welcomeScreenReducer
        };
      }
    default:
      return state;
  }
};

export default welcomeReducer;