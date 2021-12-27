import {APP_DETAILS, APP_SETTINGS} from "./actionTypes";

export function appDetailsAction(apiResponse){
  return {
    type: APP_DETAILS,
    appScreenReducer : apiResponse
  }
}


export function appSettingsAction(apiResponse) {
  return {
    type: APP_SETTINGS,
    settings: apiResponse
  }
}
