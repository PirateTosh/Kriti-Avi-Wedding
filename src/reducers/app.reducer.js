import * as actions from "../actions/actionTypes";
import { APP_DETAILS, APP_SETTINGS } from "../actions/actionTypes";

const appReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.APP_DETAILS:
      {
        return {
          ...state,
          appDetails: action.appScreenReducer
        };
      }
    case actions.APP_SETTINGS:
      {
        return {
          ...state,
          appSettings: action.settings
        }
      }
    default:
      return state;
  }
};

export default appReducer;
