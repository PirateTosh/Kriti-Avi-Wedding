import { GET_GUEST_SUMMARY_DETAILS, UPDATE_GUEST_SUMMARY_DETAILS } from "./actionTypes";

export function mySummaryAction(apiResponse) {
  return {
    type: GET_GUEST_SUMMARY_DETAILS,
    summaryScreenReducer: apiResponse
  }
}

export function updateGuestServiceAppointments(data) {
  return {
    type: UPDATE_GUEST_SUMMARY_DETAILS,
    data: data
  }
}
