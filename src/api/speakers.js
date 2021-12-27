import store from "../store"
import Meteor from "react-web-meteor"
import { EventId } from '../config/config'
import { speakersAction } from "../actions/speaker.action"

export function fetchSpeakers() {
  Meteor.call("fetch.speakers", EventId, function (error, response) {
    if (error) {
      console.log('Error in featching Speakers :: ', error)
    } else {
      store.dispatch(speakersAction(response));
    }
  })
}