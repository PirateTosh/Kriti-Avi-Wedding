import { fetchCurrentGuest } from './api/storageAPI.js';
import setupSW from './setupSW.js';
import fbSetup, { requestNotificationPermission, setupBackgroundHandler, onMessage, monitorTokenRefresh } from './firebase.js';
import { updateFCMToken }  from './api/notificationsApi.js';

const showNotification = (payload) => {
  window.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  });
};

export const setupNotifications = (guestId) => {
  setupSW()
    .then(fbSetup)
    .then(requestNotificationPermission)
    .then((token) => {
      console.log(token);
      monitorTokenRefresh((tc) => {
        updateFCMToken(guestId, tc);
      });
      return updateFCMToken(guestId, token);
    })
    .then(() => {
     // onMessage(showNotification);
    })
    .catch(err => {
      console.log(err);
    });
};
