import Meteor from "react-web-meteor";
import { EventId } from "../config/config";
import { DOWNLOADS } from "../constants";
import { getDownloadsSections } from "../actions/downloads.action";

import store from "../store";

export function fetchDownloads(guestId) {
  Meteor.call(
    "downloads.sections",
    {
      eventId: EventId,
      guestId
    },
    function(error, response) {
      if (error) {
        console.log("Error in featching Downloads Sections :: ", error);
      } else {
        console.log("Downloads sections List :: ", response);
        store.dispatch(getDownloadsSections(response));
      }
    }
  );
}
