export default () =>{
  return new Promise((resolve, reject) => {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((reg) => {
          resolve(reg);
        })
        .catch(reject);
    }
  });
};
