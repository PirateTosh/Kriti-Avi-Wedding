export const PHOTOS = {
  BASE_PATH: "photos",
  LANDING: "photo",
  MY_GROUPS: "myGroups",
  LANDING_SUB_PATH: {
    COMMENTS: "comments",
    LIKES: "likes"
  },
  SUB_PATH: {
    GUESTS: "guests",
    FAVORITE: "favorite",
    SHAREDBYME: "sharedByMe",
    MOSTLIKED: "mostLiked"
  }
};

export const DOWNLOADS = {
  BASE_PATH: "downloads"
};

const domainIP = "https://api.thekey.services";

export const API = {
  DOMAIN: domainIP,
  PORT: "",
  EVENTS: {
    BASE: "/api/v1/events/",
    DETAILS: "/details",
    PACKAGES: "/packages"
  },
  TICKET_LOG: {
    BASE: "/api/v1/ticketsLog",
    PAYMENT_DETAILS: "/updatePayment"
  }
};
