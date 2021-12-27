// Initialize Firebase
import * as firebase from 'firebase';
var config = {
  apiKey: "AIzaSyA0DOfR8bnZW_EhpsOfJX3v2cK2i3VZTrI",
  authDomain: "the-key-d295d.firebaseapp.com",
  databaseURL: "https://the-key-d295d.firebaseio.com",
  projectId: "the-key-d295d",
  storageBucket: "the-key-d295d.appspot.com",
  messagingSenderId: "119915263222"
};

export const onMessage = (cb) => {
  let messaging = firebase.messaging();
  messaging.onMessage(function(payload) {
    console.log('Message received. ', payload);
    cb && cb(payload);
    // ...
  });

  // messaging.setBackgroundMessageHandler(function(payload) {
  //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
  //   // Customize notification here
  //   cb && cb(payload);
  // });
};

export const setupBackgroundHandler = () => {
  return firebase.messaging().setBackgroundMessageHandler(function(payload) {
    const title = 'Hello World';
    const options = {
      body: payload.data.body
    };
    console.log(payload);
    return window.registration.showNotification(title, options);
  });
};

export const monitorTokenRefresh = (cb) => {
  let messaging = firebase.messaging();
  messaging.onTokenRefresh(function() {
    messaging.getToken().then(function(refreshedToken) {
      console.log('Token refreshed.');
      cb(refreshedToken)
    }).catch(function(err) {
      console.log('Unable to retrieve refreshed token ', err);
    });
  });
};

export const requestNotificationPermission = () => {

  const messaging = firebase.messaging();
  return messaging.requestPermission()
    .then(function(reg) {
      console.log(reg);
      console.log('Notification permission granted.');
      return messaging.getToken();
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
};

export default (reg) => {
  return new Promise((resolve, reject) => {
    try {
      window.registration = reg;
      console.log("Initializing firebase");
      firebase.initializeApp(config);
      firebase.messaging().usePublicVapidKey("BCO0y-GOp8pMvc0xPcqi7uAdwevceJLprXmTfl7nl4UEFefAtMlq9Isn3ZwpaYXvUY8NX1fCQ1B1C-ti3oLg5_0");
      resolve();
    }
    catch (err)  {
      console.log("Failed to initialize firebase");
      reject(err);
    }
  });
};
