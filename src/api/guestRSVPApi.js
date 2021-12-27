import store from "../store";
import Meteor from "react-web-meteor";
import { guestRsvpDetailsAction, guestRsvpSubmitAction, guestRsvpRegister } from "../actions/rsvp.action";
import { browserHistory } from "react-router";
import { dataSavedSuccessfully } from "../actions/popup.action";
export function fetchguestRSVPDetails(guestId) {
  Meteor.call("fetch.guest.rsvp", guestId, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      store.dispatch(guestRsvpDetailsAction(response));
    }
  });
}

export function submitRsvpDetails(guestId, data) {
  if (guestId.length && data.length) {
    Meteor.call("guest.rsvp.bulkSubmit", guestId, data, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        store.dispatch(dataSavedSuccessfully("RSVP submitted successfully!"));
        store.dispatch(guestRsvpSubmitAction(response));
      }
    });
  } else {
    store.dispatch(dataSavedSuccessfully("No Data availbale to submit!"));
  }
}

export function guestRsvpRegistration(guestId, registerData) {
  Meteor.call("guest.rsvp.register", guestId, registerData, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      store.dispatch(dataSavedSuccessfully("Your registration completed successfully!"));
      store.dispatch(guestRsvpRegister(response));
    }
  });
}
export function guestRsvpCompanionRegistration(guestId, registerData) {
  Meteor.call("guest.insert.campanion", guestId, registerData, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      store.dispatch(dataSavedSuccessfully("Companion added successfully!"));
      store.dispatch(guestRsvpRegister(response));
      browserHistory.push('/menus');
    }
  });
}
