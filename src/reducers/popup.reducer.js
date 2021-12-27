import { DATA_SAVED, INVALID_LOGIN } from "../actions/actionTypes";
import * as actions from "../actions/actionTypes";
import cloneDeep from "lodash/cloneDeep";

const popupReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.DATA_SAVED:
      {
        return {
          ...state,
          ...getData(state, action.payload)
        };
      }
    case actions.INVALID_LOGIN:
      {
        return {
          ...state,
          ...getData(state, action.payload)
        };
      }
    default:
      return state;
  }
};

function getData(state, payload) {
  const prevData = cloneDeep(state);
  if (!prevData.count) {
    return {
      data: payload,
      count: 1
    }
  } else {
    return {
      data: payload,
      count: prevData.count + 1
    }
  }
}

export default popupReducer;