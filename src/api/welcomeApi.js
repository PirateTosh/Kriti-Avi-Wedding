import store from "../store";
import Meteor from "react-web-meteor";
import { welcomeScreenAction } from "../actions/welcome.action";
import { EventId } from "../config/config";

export function fetchWelcomeDetails() {
  Meteor.call("fetch.app.settings", EventId, function (error, response) {
    if (error) {
    } else {
      store.dispatch(welcomeScreenAction(response));
    }
  })
}