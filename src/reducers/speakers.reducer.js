import * as actions from "../actions/actionTypes";

const speakerReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.GET_SPEAKERS:
      {
        return {
          ...state,
          speakerScreenDetails: action.speakerScreenReducer
        };
      }
    default:
      return state;
  }
};

export default speakerReducer;