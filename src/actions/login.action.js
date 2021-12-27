import {LOGIN_DETAILS} from "./actionTypes";

export function loginDetails(apiResponse){
    return {
        type: LOGIN_DETAILS,
        guestDetails : apiResponse.guest,
        EventName: apiResponse.event.basicDetails.eventName
    }
}

