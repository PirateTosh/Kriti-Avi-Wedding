import { GET_SPEAKERS } from "./actionTypes"

export function speakersAction(apiResponse){
  return {
    type: GET_SPEAKERS,
    speakerScreenReducer : apiResponse
  }
}