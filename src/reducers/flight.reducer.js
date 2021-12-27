import * as actions from "../actions/actionTypes";

const flightReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.GET_GUEST_FLIGHT: {
      return {
        ...state,
        guestFlights: action.flightReducer,
      };
    }
    case actions.GET_AIRPORTLIST: {
      return {
        ...state,
        airportList : action.flightReducer
      }
    }
    case actions.GET_AIRLINELIST: {
      return {
        ...state,
        airlineList : action.flightReducer
      }
    }
    case actions.GET_SEARCHRESULT: {
      return {
        ...state,
        searchResult : action.flightReducer
      }
    }
    default: {
      return state;
    }
  }
};

export default flightReducer;