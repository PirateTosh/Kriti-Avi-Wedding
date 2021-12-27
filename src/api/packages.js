import Meteor from "react-web-meteor";
import { EventId } from "../config/config";
import {
  familyMembersAction,
  packagesAction,
  myPurchasesAction,
  packageEventDetailsAction
} from "../actions/packages.action";

import store from "../store";
import { API } from "../constants";

export function fetchFamilyMembers(guestId) {
  Meteor.call("fetch.guest.family", guestId, function(error, response) {
    if (error) {
      console.log("Error in featching Family members :: ", error);
    } else {
      console.log("Family Members :: ", response);
      store.dispatch(familyMembersAction(response));
    }
  });
}

export function fetchPackages() {
  fetch(`${API.DOMAIN}${API.EVENTS.BASE}${EventId}${API.EVENTS.PACKAGES}`)
    .then(response => response.json())
    .then(data => store.dispatch(packagesAction(data)));
}

export function fetchPackageEventDetails() {
  fetch(`${API.DOMAIN}${API.EVENTS.BASE}${EventId}`)
    .then(response => response.json())
    .then(data => store.dispatch(packageEventDetailsAction(data)));
}

export function fetchMyPurchases(guestId) {
  fetch(`${API.DOMAIN}${API.TICKET_LOG.BASE}/${guestId}`)
    .then(response => response.json())
    .then(data => store.dispatch(myPurchasesAction(data)));
}

export function createTicketLog(payload, cb) {
  fetch(`${API.DOMAIN}${API.TICKET_LOG.BASE}`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(res => cb(res));
}

export function updateTicketLog(payload, cb) {
  fetch(
    `${API.DOMAIN}${API.TICKET_LOG.BASE}${API.TICKET_LOG.PAYMENT_DETAILS}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
    .then(res => res.json())
    .then(res => cb(res));
}
