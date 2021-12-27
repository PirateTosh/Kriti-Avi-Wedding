import store from "../store";
import Meteor from "react-web-meteor";
import {guestFlight, guestFlightAdd, airportList, airlineList, searchResult} from "../actions/flight.action";
import {dataSavedSuccessfully} from "../actions/popup.action";
import {browserHistory} from "react-router";


export function fetchGuestFlight(guestId) {
  Meteor.call("fetch.bookedFlight", guestId, function (error, response) {
    if (error) {
     console.log("Server Error :::", error)
    } else {
      store.dispatch(guestFlight(response));
    }
  });
}

export function guestFlightAddNew(data){
  Meteor.call('book.guest_flight', data, (error, response) => {
    if(error){
      console.log(error);
    } else {
      store.dispatch(guestFlightAdd(data));
      fetchGuestFlight(data.guestId);
      store.dispatch(dataSavedSuccessfully("Flight Added Successfully"));
      browserHistory.push("/travel/booked-ticket");
    }
  })
}

export function guestFlightDelete(id){
  Meteor.call('delete.bookedFlight', id, (err, res) => {
    if(err){
      console.log(err);
    } else {
      store.dispatch(dataSavedSuccessfully("Flight Deleted Successfully"));
    }
  })
}

export function fetchAirportList(){
  Meteor.call('fetch.airportList', (err, res) =>{
    if(err){
      console.log(err);
    } else {
      // return res;
      store.dispatch(airportList(res));
    }
  });
}

export function fetchAirlineList(){
  Meteor.call('fetch.airlineList', (err, res) =>{
    if(err){
      console.log(err);
    } else {
      // return res;
      store.dispatch(airlineList(res));
    }
  });
}