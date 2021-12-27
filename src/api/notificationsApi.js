import store from "../store";
import Meteor from "react-web-meteor";

export const updateFCMToken = (guestId, token) => {
  return new Promise((resolve, reject) => {
    Meteor.call('fcm.token.update', { guestId, token, isWeb: true }, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}
