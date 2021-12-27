import { GET_RSVP_DETAILS, SUBMIT_RSVP_DETAILS, REGISTERGUESTRSVP, UPDATERSVP } from "./actionTypes";

export function guestRsvpDetailsAction(apiResponse) {
  return {
    type: GET_RSVP_DETAILS,
    rsvpScreenReducer: apiResponse
  }
}

export function guestRsvpSubmitAction(apiResponse) {
  return {
    type: SUBMIT_RSVP_DETAILS,
    rsvpScreenReducer: apiResponse
  }
}

export function guestRsvpRegister(apiResponse) {
  return {
    type: REGISTERGUESTRSVP,
    rsvpScreenReducer: apiResponse
  }
}

export function updateUserRSVP(guestId, data) {
  return {
    type: UPDATERSVP,
    guestId: guestId,
    data: data
  }
}
