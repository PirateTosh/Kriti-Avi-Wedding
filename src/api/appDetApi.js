import store from "../store";
import Meteor from "react-web-meteor";
import { appDetailsAction, appSettingsAction } from "../actions/app.action";
import { EventId } from '../config/config';


export function fetchAppDetails() {
  Meteor.call("fetch.event", { eventId: EventId }, function (error, response) {
    if (error) {
    } else {
      store.dispatch(appDetailsAction(response));
    }
  });
}

export function fetchAppSettings() {
  Meteor.call("fetch.app.settings", EventId, function (error, response) {
    if (error) {
    } else {
      store.dispatch(appSettingsAction(response));
    }
  });
}
