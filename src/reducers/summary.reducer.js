import * as actions from "../actions/actionTypes";
import cloneDeep from "lodash/cloneDeep";

const mySummaryReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.GET_GUEST_SUMMARY_DETAILS:
      {
        return {
          ...state,
          eventSummary: action.summaryScreenReducer
        };
      }
    case actions.UPDATE_GUEST_SUMMARY_DETAILS:
      {
        return {
          ...state,
          eventSummary: setGuestSummary(action.data, state.eventSummary)
        }
      }
    default:
      return state;
  }
};

function doesServiceExist(serviceId, bookings) {
  bookings.map((booking) => {
    if (booking.serviceId === serviceId) {
      return true;
    }
  });
  return false;
}

function setGuestSummary(data, eventSummary) {
  let updatedEventSummary = cloneDeep(eventSummary);
  const newSummary = updatedEventSummary.map((gt) => {
    let objBooking = {};
    data.map((dataVal) => {
      var isService = doesServiceExist(dataVal.serviceId, gt.serviceBookings);
      if (dataVal.guestId === gt._id && !isService) {
        objBooking = {
          guestId: dataVal.guestId,
          serviceId: dataVal.serviceId,
          serviceTime: dataVal.serviceTime,
          serviceDate: dataVal.serviceDate
        };
      }
    });

    if (objBooking) {
      gt.serviceBookings.push(objBooking);
    }
    gt.serviceBookings.map((booking) => {
      data.map((dataVal) => {
        if (booking.serviceId === dataVal.serviceId && dataVal.guestId === booking.guestId) {
          if (dataVal.deleted === true) {
            booking.serviceTime = '';
          }
          else {
            booking.serviceTime = dataVal.serviceTime;
          }
        }
      });
      return booking;
    });
    return gt;
  });
  return newSummary;
}
export default mySummaryReducer;