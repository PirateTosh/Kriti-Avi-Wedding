import store from "../store"
import Meteor from "react-web-meteor"
import { EventId } from '../config/config'
import { sponsorsAction } from "../actions/sponsor.action"

export function fetchSponsors() {
  console.log('Fetching Sponsors ...')
  Meteor.call("fetch.sponsors", EventId, function (error, response) {
    if (error) {
      console.log('Error in featching Sponsors :: ', error)
    } else {
      store.dispatch(sponsorsAction(response));
    }
  })
}