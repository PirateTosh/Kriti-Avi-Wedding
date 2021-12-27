import * as actions from "../actions/actionTypes";
import cloneDeep from "lodash/cloneDeep";

const guestInformationReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.GET_GUEST_INFORMATION_DETAILS: {
      return {
        ...state,
        guestInformation: action.guestInformationReducer
      };
    }
    case actions.GET_GUEST_LOGGEDIN_DETAILS: {
      return {
        ...state,
        guestLoggedIn: action.guestInformationReducer
      };
    }
    case actions.GET_NEAREST_AIRPORT_DETAILS: {
      return {
        ...state,
        nearestAirportList: action.nearestAirportReducer
      };
    }
    case actions.SET_GUEST_INFORMATION_PHOTO_ID: {
      // return Object.assign({}, state, {updatedGuestInformation : setGuestInformationPhotoID(state.guestInformation, action.url, action.id)});
      return {
        ...state,
        // updatedGuestInformation : setGuestInformationPhotoID(state.guestInformation, action.url, action.id)
        guestInformation: setGuestInformationPhotoID(
          action.url,
          action.id,
          state.guestInformation
        )
      };
    }
    case actions.SET_WISHES_AND_FEEDBACK: {
      // return Object.assign({}, state, {updatedGuestInformation : setGuestInformationPhotoID(state.guestInformation, action.url, action.id)});
      return {
        ...state,
        // updatedGuestInformation : setGuestInformationPhotoID(state.guestInformation, action.url, action.id)
        WishesAndFeedback: {
          wishListAndFeedbackData: action.data,
          isWishListEnabled: action.isWishEnabled
        }
      };
    }
    case actions.SET_EVENT_PREFERENCE: {
      // return Object.assign({}, state, {updatedGuestInformation : setGuestInformationPhotoID(state.guestInformation, action.url, action.id)});
      return {
        ...state,
        // updatedGuestInformation : setGuestInformationPhotoID(state.guestInformation, action.url, action.id)
        guestPreference: action.eventScreenReducer
      };
    }

    case actions.SET_EVENT_PREFERENCE_SERVICES: {
      // return Object.assign({}, state, {updatedGuestInformation : setGuestInformationPhotoID(state.guestInformation, action.url, action.id)});
      return {
        ...state,
        // updatedGuestInformation : setGuestInformationPhotoID(state.guestInformation, action.url, action.id)
        servicePreference: action.eventScreenReducer
      };
    }

    case actions.UPDATE_GUEST_INFO: {
      // return Object.assign({}, state, {guestInformation: setGuestInformation(action.guestId, action.data, state.guestInformation)});
      return {
        ...state,
        guestInformation: setGuestInformation(
          action.guestId,
          action.data,
          state.guestInformation
        )
      };
    }

    case actions.SET_GUEST_INFO: {
      return {
        ...state,
        guestInformation: setGuestInformation(
          action.guestId,
          action.data,
          state.guestInformation
        )
      };
    }

    default:
      return state;
  }
};

function setGuestInformationPhotoID(url, id, guestInformation) {
  let updatedGuestInformation = cloneDeep(guestInformation);
  updatedGuestInformation.map(gt => {
    let newGT = cloneDeep(gt);
    if (newGT._id === id) {
      newGT.photoId = url;
    }
    return newGT;
  });
  return updatedGuestInformation;
}

function setGuestInformation(guestId, data, guestInformation) {
  let updatedGuestInformation = cloneDeep(guestInformation);
  const newGuestInfo = updatedGuestInformation.map(gt => {
    let newGT = Object.assign({}, gt);
    if (gt._id === guestId) {
      newGT = Object.assign({}, gt, data);
      // newGT.insuranceInformation = Object.assign({}, gt.insuranceInformation, data.insuranceInformation);
    }
    return newGT;
  });
  return newGuestInfo;
}

export default guestInformationReducer;
