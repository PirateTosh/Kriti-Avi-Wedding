import {
  GET_GUEST_INFORMATION_DETAILS,
  SET_GUEST_INFORMATION_PHOTO_ID,
  SET_WISHES_AND_FEEDBACK,
  SET_EVENT_PREFERENCE,
  SET_GUEST_INFO,
  SET_EVENT_PREFERENCE_SERVICES,
  UPDATE_GUEST_INFO,
  GET_GUEST_LOGGEDIN_DETAILS,
  GET_ALL_GUESTS,
} from "./actionTypes";

export function guestInformationAction(apiResponse) {
  return {
    type: GET_GUEST_INFORMATION_DETAILS,
    guestInformationReducer: apiResponse
  }
}

export function guestLoggedInAction(apiResponse) {
  return {
    type: GET_GUEST_LOGGEDIN_DETAILS,
    guestInformationReducer: apiResponse
  }
}

export function guestInformationPhotoIdUpdateAction(url, id) {
  return {
    type: SET_GUEST_INFORMATION_PHOTO_ID,
    url: url,
    id: id
  }
}

export function guestWishesAndFeedbackAction(apiResponse, isWishEnabled) {
  return {
    type: SET_WISHES_AND_FEEDBACK,
    data: apiResponse,
    isWishEnabled: isWishEnabled

  }
}

export function guestPreferenceAction(apiResponse) {
  return {
    type: SET_EVENT_PREFERENCE,
    eventScreenReducer: apiResponse
  }
}

export function guestAvailableServicesAction(apiResponse) {
  return {
    type: SET_EVENT_PREFERENCE_SERVICES,
    eventScreenReducer: apiResponse
  }
}

export function updateGuestPreferenceInStore(guestId, data) {
  return {
    type: SET_GUEST_INFO
  }
}

export function updateGuestInformationInStore(guestId, data) {
  return {
    type: UPDATE_GUEST_INFO,
    data: data,
    guestId: guestId
  }
}
