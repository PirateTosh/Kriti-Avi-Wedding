import get from "lodash/get";

export const getPackages = (state) => {
  console.log("Getting Packages ::", state);
  return get(state, "packagesReducer.packages");
};

export const getMyPurchases = (state) => {
  console.log("Getting Additional Packages ::", state);
  return get(state, "packagesReducer.myPurchases");
};

export const getFamilyMembers = (state) => {
  console.log("Getting Family Members ::", state);
  return get(state, "packagesReducer.family");
};

export const getPackageEventDetails = (state) => {
  console.log("Getting getPackageEventDetails ::", state);
  return get(state, "packagesReducer.event");
};
