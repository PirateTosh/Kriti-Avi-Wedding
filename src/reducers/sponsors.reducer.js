import * as actions from "../actions/actionTypes";

const sponsorReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.GET_SPONSORS:
      {
        return {
          ...state,
          sponsorScreenDetails: action.sponsorScreenReducer
        };
      }
    default:
      return state;
  }
};

export default sponsorReducer;