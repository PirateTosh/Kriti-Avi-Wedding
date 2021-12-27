import { GET_GUEST_FLIGHT, ADD_GUEST_FLIGHT, UPDATE_GUEST_FLIGHT, GET_AIRPORTLIST, GET_AIRLINELIST, GET_SEARCHRESULT } from './actionTypes'

export function guestFlight(apiResponse){
  return {
    type: GET_GUEST_FLIGHT,
    flightReducer: apiResponse
  }
}

export function airportList(apiResponse){
  return {
    type: GET_AIRPORTLIST,
    flightReducer: apiResponse
  }
}

export function airlineList(apiResponse){
  return {
    type: GET_AIRLINELIST,
    flightReducer: apiResponse
  }
}

export function guestFlightAdd(apiResponse){
  return {
    type: ADD_GUEST_FLIGHT,
    flightReducer: apiResponse
  }
}

export function guestFlightUpdate(apiResponse){
  return {
    type: UPDATE_GUEST_FLIGHT,
    flightReducer: apiResponse
  }
}

export function searchResult(apiResponse){
  return{
    type : GET_SEARCHRESULT,
    flightReducer: apiResponse
  }
}