import get from "lodash/get";

export const getSettings = (state) => {
  console.log("Getting PhotoShared settings ::", state);
  return get(state, "photosSharedReducer.settings");
};
export const getFeaturedPhotos = (state) => {
  console.log("Getting Featured Shared Photos ::", state);
  return get(state, "photosSharedReducer.featuredPhotos");
};
export const getGuestSharedPhotos = (state) => {
  console.log("Getting Guest Shared Photos ::");
  return get(state, "photosSharedReducer.guestPhotos");
};

export const getPhotoDetail = (state) => {
  console.log('Getting individual photo details::::');
  return (get(state, 'photosSharedReducer.photoDetail'));
}
export const getImageDownloadDetail = (state) => {
  console.log('Getting individual photo details::::');
  return (get(state, 'photosSharedReducer.photoDownloadDetails'));
}

export const getAllGuests = (state) => {
  // console.log("Getting Guests list", state);
  return get(state, 'photosSharedReducer.guestsList');
}

export const getGuestGroups = (state) => {
  console.log("Getting Groups list");
  return get(state, 'photosSharedReducer.guestGroups');
}

export const getCommentsList = (state) => {
  console.log('getting comments list');
  return get(state, 'photosSharedReducer.comments');
}
export const getParentComment = (state) => {
  console.log('getting comments list');
  return get(state, 'photosSharedReducer.parentComment');
}

export const getLikesList = (state) => {
  console.log('getting likes list');
  return get(state, 'photosSharedReducer.likes');
}
