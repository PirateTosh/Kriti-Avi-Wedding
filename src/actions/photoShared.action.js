import {
  GET_FEATURED_PHOTOS,
  GET_SHARED_PHOTOS,
  GET_GUEST_GROUPS,
  GET_ALL_GUESTS,
  GET_PHOTOSHARE_SETTINGS,
  GET_PHOTO_DETAILS,
  GET_PHOTO_COMMENT_LIST,
  GET_PHOTO_LIKES_LIST,
  GET_PHOTOS_DOWNLOAD_DETAILS,
} from "./actionTypes";

export function featuredSettingsAction(apiResponse) {
  return {
    type: GET_PHOTOSHARE_SETTINGS,
    settings: apiResponse
  }
}

export function featuredPhotosAction(apiResponse) {
  return {
    type: GET_FEATURED_PHOTOS,
    photoReducer: apiResponse
  };
}

export function photoDetailAction(apiResponse) {
  return {
    type: GET_PHOTO_DETAILS,
    photoDetail: apiResponse
  };
}

export function sharedPhotosAction(apiResponse, isNewShared) {
  return {
    type: GET_SHARED_PHOTOS,
    photoReducer: apiResponse,
    isNewShared
  };
}

export function imageDownloadDetails(apiResponse) {
  return {
    type: GET_PHOTOS_DOWNLOAD_DETAILS,
    photoDownloadDetails: apiResponse ? apiResponse.base64 : ''
  };
}

export function allGuestsList(response){
  return {
    type: GET_ALL_GUESTS,
    guestsList: response,
  }
}

export function guestGroupsListAction(apiResponse, isNewGroup){
  return {
    type: GET_GUEST_GROUPS,
    guestGroups: apiResponse,
    isNewGroup
  }
}

export function getCommentListAction(apiResponse, isNewComment) {
  return {
    type: GET_PHOTO_COMMENT_LIST,
    comments: apiResponse.comments,
    parentComment: apiResponse.parentComment,
    isNewComment
  }
}

export function getLikesListAction(apiResponse) {
  return {
    type: GET_PHOTO_LIKES_LIST,
    likes: apiResponse
  }
}
