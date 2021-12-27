import Meteor from "react-web-meteor";
import { EventId } from "../config/config";
import { PHOTOS } from "../constants";
import {
  featuredPhotosAction,
  sharedPhotosAction,
  guestGroupsListAction,
  allGuestsList,
  featuredSettingsAction,
  photoDetailAction,
  getCommentListAction,
  getLikesListAction,
  imageDownloadDetails,
} from "../actions/photoShared.action";

import store from "../store";

export function fetchSettings() {
  Meteor.call("photoshare.fetchSettings", EventId, function(error, response) {
    if (error) {
      console.log("Error in featching PhotoShare settings :: ", error);
    } else {
      console.log("PhotoShared settings :: ", response);
      store.dispatch(featuredSettingsAction(response));
    }
  });
}

export function fetchFeaturedPhotos() {
  Meteor.call("photoshare.featuredPhotos", EventId, function(error, response) {
    if (error) {
      console.log("Error in featching Featured Photos :: ", error);
    } else {
      console.log("Featured Photos List :: ", response);
      store.dispatch(featuredPhotosAction(response));
    }
  });
}

export function fetchPhotoDetail(photoId, guestId) {
  console.log(photoId, "Fetch Photo details::::::::::::", guestId);
  Meteor.call(
    "photoshare.photoDetail",
    { photoId, guestId, eventId: EventId },
    function(error, response) {
      if (error) {
        console.log("Error in featching Photo details :: ", error);
      } else {
        console.log("Photo Data :: ", response);
        store.dispatch(photoDetailAction(response));
      }
    }
  );
}

export function fetchPhotos(category, guestId) {
  Meteor.call(
    "photoshare.sharedPhotos",
    {
      category: PHOTOS.SUB_PATH[category.toUpperCase()],
      eventId: EventId,
      guestId
    },
    function(error, response) {
      if (error) {
        console.log("Error in featching Shared Photos :: ", error);
      } else {
        console.log(category, "Shared Photos List :: ", response);
        store.dispatch(sharedPhotosAction(response));
      }
    }
  );
}
export function fetchImageDownloadDetails(photoUrl) {
  Meteor.call(
    "photoshare.photoDownload",
    {
      photoUrl
    },
    function(error, response) {
      if (error) {
        console.log("Error in featching Image Download details :: ", error);
      } else {
        console.log("Image Download details :: ", response);
        store.dispatch(imageDownloadDetails(response));
      }
    }
  );
}

export function sharePhoto(data) {
  return new Promise((resolve, reject) => {
    data.eventId = EventId;
    Meteor.call("photoshare.save.sharedPhotos", data, function(
      error,
      response
    ) {
      if (error) {
        console.log("Error while saving Photos :: ", error);
        reject(error);
      } else {
        console.log("Shared Photos List :: ", response);
        store.dispatch(sharedPhotosAction(response, true));
        resolve(response);
      }
    });
  });
}

export function createGroup(data) {
  return new Promise((resolve, reject) => {
    data.eventId = EventId;
    Meteor.call("photoshare.create.group", data, (error, response) => {
      if (error) {
        console.log("Error while creating group :: ", error);
        reject(error);
      } else {
        console.log("Create Group :: ", response);
        store.dispatch(guestGroupsListAction(response, true));
        resolve(response);
      }
    });
  });
}

export const fetchAllGuests = () => {
  Meteor.call("photoshare.allGuests", EventId, function(error, response) {
    if (error) {
      console.log("Error in featching All Guests :: ", error);
    } else {
      store.dispatch(allGuestsList(response));
    }
  });
};

export const fetchGuestGroups = guestId => {
  Meteor.call(
    "photoshare.guest.groups",
    { eventId: EventId, guestId },
    function(error, response) {
      if (error) {
        console.log("Error in featching Guest groups list :: ", error);
      } else {
        store.dispatch(guestGroupsListAction(response));
      }
    }
  );
};

export const likeDislikePhoto = (photoId, guestId, callback) => {
  Meteor.call("photoshare.like.photo", { guestId, photoId, eventId: EventId }, callback);
};

export const fetchCommentsList = ({photoId, parentCommentId}) => {
  Meteor.call("photoshare.comments", ({photoId, parentCommentId}), function(error, response) {
    if (error) {
      console.log("Error in fetching comments ::: ", error);
    } else {
      store.dispatch(getCommentListAction(response));
    }
  });
};
export const commentOnPhoto = data => {
  return new Promise((resolve, reject) => {
    Meteor.call("photoshare.save.comment", data, function(error, response) {
      if (error) {
        console.log("Error in comment post :: ", error);
        reject(error);
      } else {
        store.dispatch(getCommentListAction({comments: response}, true));
        resolve(response);
      }
    });
  });
};

export const fetchLikesList = photoId => {
  Meteor.call("photoshare.likes", photoId, function(error, response) {
    if (error) {
      console.log("Error in fetching likes ::: ", error);
    } else {
      store.dispatch(getLikesListAction(response));
    }
  });
};

export const deletePhoto = (photoId, guestId, callback) => {
  Meteor.call("photoshare.delete.photo", { guestId, photoId }, callback);
};
