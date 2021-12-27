import {
    GET_DOWNLOADS,
  } from "./actionTypes";
  
  export function getDownloadsSections(apiResponse) {
    return {
      type: GET_DOWNLOADS,
      downloads: apiResponse
    };
  }
  