import * as actions from "../actions/actionTypes";

const packagesReducer = (
  state = {
    family: [],
    packages: [],
    myPurchases: [],
  },
  action
) => {
  switch (action.type) {
    case actions.GET_FAMILY_MEMBERS: {
      return {
        ...state,
        family: action.family
      };
    }
    case actions.GET_PACKAGES: {
      return {
        ...state,
        packages: action.packages
      };
    }
    case actions.GET_MY_PURCHASES: {
      return {
        ...state,
        myPurchases: action.myPurchases
      };
    }
    case actions.GET_PACKAGES_EVENT: {
      return {
        ...state,
        event: action.event
      };
    }
    default:
      return state;
  }
};

export default packagesReducer;
