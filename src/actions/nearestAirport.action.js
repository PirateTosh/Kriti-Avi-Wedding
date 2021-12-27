import {GET_NEAREST_AIRPORT_DETAILS} from "./actionTypes";

export function nearestAirportAction(apiResponse){
    return {
        type: GET_NEAREST_AIRPORT_DETAILS,
        nearestAirportReducer : apiResponse
    }
}

