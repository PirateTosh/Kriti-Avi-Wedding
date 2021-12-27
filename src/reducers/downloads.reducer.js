import * as actions from "../actions/actionTypes";

const downloadsReducer = (
  state = {
    sections: [],
  },
  action
) => {
  switch (action.type) {
    case actions.GET_DOWNLOADS: {
      return {
        ...state,
        downloads: action.downloads
      };
    }
    default:
      return state;
  }
};

export default downloadsReducer;
