import * as actions from "../actions/actionTypes";

const photosSharedReducer = (
  state = {
    featuredPhotos: [],
    guestPhotos: [],
    guestsList: [],
    guestGroups: [],
    photoDetails: {},
    comments: [],
    settings: []
  },
  action
) => {
  switch (action.type) {
    case actions.GET_PHOTOSHARE_SETTINGS: {
      return {
        ...state,
        settings: action.settings
      };
    }
    case actions.GET_FEATURED_PHOTOS: {
      return {
        ...state,
        featuredPhotos: action.photoReducer
      };
    }
    case actions.GET_SHARED_PHOTOS: {
      const photos = action.isNewShared
        ? { ...state.guestPhotos }
        : action.photoReducer;

      if (action.isNewShared) {
        if (photos[action.photoReducer.key]) {
          photos[action.photoReducer.key] = [
            action.photoReducer.data,
            ...photos[action.photoReducer.key]
          ];
        } else {
          photos[action.photoReducer.key] = [action.photoReducer.data];
        }
      }
      return {
        ...state,
        guestPhotos: photos
      };
    }
    case actions.GET_ALL_GUESTS: {
      return {
        ...state,
        guestsList: action.guestsList
      };
    }
    case actions.GET_GUEST_GROUPS: {
      const groups = action.isNewGroup
        ? [action.guestGroups, ...state.guestGroups]
        : action.guestGroups;
      return {
        ...state,
        guestGroups: groups
      };
    }
    case actions.GET_PHOTO_DETAILS: {
      return {
        ...state,
        photoDetail: action.photoDetail
      };
    }
    case actions.GET_PHOTOS_DOWNLOAD_DETAILS: {
      return {
        ...state,
        photoDownloadDetails: action.photoDownloadDetails
      }
    }
    case actions.GET_PHOTO_COMMENT_LIST: {
      let comments = [];
      if (action.isNewComment) {
        let isChildComment = 0;
        comments = [...state.comments].map(comment => {
          const cmt = { ...comment };
          if (comment._id === action.comments.parentCommentId) {
            cmt.childCount = {
              _id: comment._id,
              count: comment.childCount ? comment.childCount.count + 1 : 1
            };
            isChildComment = 1;
          }
          return cmt;
        });
        if (!isChildComment) {
          comments = [...state.comments, action.comments];
        }
      } else {
        comments = action.comments;
      }
      return {
        ...state,
        comments,
        parentComment: action.parentComment
      };
    }
    case actions.GET_PHOTO_LIKES_LIST: {
      return {
        ...state,
        likes: action.likes
      };
    }
    default:
      return state;
  }
};

export default photosSharedReducer;
