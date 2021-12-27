import store from "../store";
import Meteor from "react-web-meteor";
import {eventDetailsAction} from "../actions/event.action";
import {browserHistory} from "react-router";
import {EventId} from "../config/config";

export function fetchEventDetails(guestId, flag) {
  Meteor.call("fetch.guest.subevents", { eventId: EventId, guestId: guestId }, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      store.dispatch(eventDetailsAction(response));
      if (!flag) {
        browserHistory.push("/eventDetails");
      }
    }
  });
}