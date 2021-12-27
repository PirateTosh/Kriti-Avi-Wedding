import * as actions from "../actions/actionTypes";

const rsvpReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.GET_RSVP_DETAILS:
      {
        return {
          ...state,
          rsvpDetails: action.rsvpScreenReducer
        };
      }
    case actions.UPDATERSVP:
      {
        return {
          ...state,
          rsvpDetails: updateData(action.guestId, action.data, state)
        }
      }
    default:
      return state;
  }
};

function updateData(state) {
  console.log(':::', state);
}

export default rsvpReducer;