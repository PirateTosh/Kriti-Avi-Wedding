import { GET_EVENT_DETAILS, SET_EVENT_PREFERENCE } from "./actionTypes";

export function eventDetailsAction(apiResponse) {
  return {
    type: GET_EVENT_DETAILS,
    eventScreenReducer: apiResponse
  }
}

