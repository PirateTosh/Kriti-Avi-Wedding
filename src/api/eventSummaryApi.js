import store from "../store";
import Meteor from "react-web-meteor";
import { mySummaryAction } from "../actions/summary.action";
import { browserHistory } from "react-router";
import { EventId } from "../config/config";

export function fetchEventSummary(guestId, flag) {
  Meteor.call("fetch.guest.summary", guestId, function (error, result) {
    if (error) {

    } else {

      store.dispatch(mySummaryAction(result));
      if (!flag) {
        browserHistory.push("/mySummary");
      }
      else {
        browserHistory.push('/myPreferences');
      }
    }
  });
}