import store from "../store";
import Meteor from "react-web-meteor";
import { loginDetails } from "../actions/login.action";
import { fetchWelcomeDetails } from "./welcomeApi";
import { fetchGuestInformation } from "./guestInformationApi";
import { EventId } from '../config/config.js';
import { browserHistory } from 'react-router';
import { getEventId } from "../selectors";
import { storeGuest, storeEvent } from '../api/storageAPI.js';
import { setupNotifications } from '../notifications.js';
import { invalidLogin } from "../actions/popup.action";
import Popup from 'react-popup';
import { subscribeToChat } from './chatApi.js';

export function fetchLoginDetails(email, password) {
  Meteor.call("guest.login", { userEmail: (email.toLowerCase()), userPassword: password, eventId: EventId }, function (error, response) {
    if (error) {
      Popup.alert('Invalid Login Credentials');
      store.dispatch(invalidLogin("Invalid Login Credentials"));
    }
    else {
      window.localStorage.setItem("isLoggedIn", true);
      store.dispatch(loginDetails(response));
      storeGuest(response.guest);
      storeEvent(response.event);
      setupNotifications(response.guest._id);
      if (response && response.guest && response.guest._id) {
        fetchGuestInformation(response.guest._id, false);
        fetchWelcomeDetails();
        subscribeToChat({ eventId: EventId, guestId: response.guest._id });
        browserHistory.push("/dashboard");
      }
    }
  });
}
