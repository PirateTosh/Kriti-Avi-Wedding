import get from "lodash/get";

export const getDownloads = (state) => {
  console.log("Getting Downloads ::", state);
  return get(state, "downloadsReducer.downloads");
};
