import { GET_SPONSORS } from "./actionTypes"

export function sponsorsAction(apiResponse){
  return {
    type: GET_SPONSORS,
    sponsorScreenReducer : apiResponse
  }
}