import {
    GET_PACKAGES,
    GET_FAMILY_MEMBERS,
    GET_MY_PURCHASES,
    GET_PACKAGES_EVENT
  } from "./actionTypes";
  
  export function familyMembersAction(apiResponse) {
    return {
      type: GET_FAMILY_MEMBERS,
      family: apiResponse
    }
  }
  
  export function packagesAction(apiResponse) {
    return {
      type: GET_PACKAGES,
      packages: apiResponse
    };
  }
  
  export function myPurchasesAction(apiResponse) {
    return {
      type: GET_MY_PURCHASES,
      myPurchases: apiResponse && !apiResponse.error ? apiResponse : []
    };
  }

  export function packageEventDetailsAction(apiResponse) {
    return {
      type: GET_PACKAGES_EVENT,
      event: apiResponse
    };
  }
  