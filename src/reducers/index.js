import { combineReducers } from "redux";
import loginReducer from "./login.reducer";
import welcomeReducer from "./welcome.reducer";
import flightReducer from "./flight.reducer";
import eventReducer from "./event.reducer";
import rsvpReducer from "./rsvp.reducer";
import guestInformationReducer from "./guestInformation.reducer";
import appConfigReducer from "./app.reducer";
import mySummaryReducer from "./summary.reducer";
import popupReducer from "./popup.reducer";
import myChatReducer from "./chat.reducer";
import speakerReducer from './speakers.reducer'
import sponsorReducer from './sponsors.reducer';
import photosSharedReducer from './photoShared.reducer';
import downloadsReducer from './downloads.reducer';
import packagesReducer from './packages.reducer';

const appReducers = combineReducers({
  loginReducer,
  welcomeReducer,
  eventReducer,
  rsvpReducer,
  guestInformationReducer,
  appConfigReducer,
  mySummaryReducer,
  popupReducer,
  myChatReducer,
  flightReducer,
  speakerReducer,
  sponsorReducer,
  photosSharedReducer,
  downloadsReducer,
  packagesReducer,
});

const reducers = (state = {}, action) => {
  if (action.type === 'LOG_OUT') {
    state = action.data;
  }
  return appReducers(state, action)
};

export default reducers;