import store from "../store";
import Meteor from "react-web-meteor";
import {guestInformationAction,
  guestLoggedInAction,
  guestInformationPhotoIdUpdateAction,
  guestWishesAndFeedbackAction,
  guestPreferenceAction,
  updateGuestPreferenceInStore,
  guestAvailableServicesAction,
  updateGuestInformationInStore
} from "../actions/guestInformation.action";
import {updateGuestServiceAppointments} from "../actions/summary.action";
import {nearestAirportAction} from "../actions/nearestAirport.action";
import {dataSavedSuccessfully} from "../actions/popup.action";
import {browserHistory} from "react-router";

function uploadFile(url, file, onSuccess, onFail) {
  const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      // handle notifications about upload progress: e.loaded / e.total
      console.log('progress');
      console.log(e);
    }, false);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        onSuccess(xhr.responseURL.split('?')[0]);
      } else {
        onFail(file.uri);
      }
    }
  };

  xhr.open('PUT', url);
  xhr.setRequestHeader('X-Amz-ACL', 'public-read');
    // for text file: text/plain, for binary file: application/octet-stream
  xhr.setRequestHeader('Content-Type', file.type);
  xhr.send(file);
}

export function fetchGuestInformation(guestId, redirect=false) {
  Meteor.call("fetch.guest.family", guestId, function(error, response) {
    if (error) {
        console.log(error);
    } else {
      store.dispatch(guestInformationAction(response));
      if(redirect) {
        browserHistory.push("/myInformation");
      }
      fetchNearestAirport();
    }
  });
}

export function fetchLoggedInGuest(guestId, redirect=true) {
  Meteor.call("fetch.guest", guestId, function(error, response) {
    if (error) {
        console.log(error);
    } else {
      store.dispatch(guestLoggedInAction(response));
      if(redirect) {
        browserHistory.push("/wishes");
      }
    }
  });
}

export function saveguestPreference(guestId, data, info) { console.log('guest submit data',data);
  Meteor.call("guest.details.submit", {guestId: guestId, data: info}, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      store.dispatch(updateGuestPreferenceInStore(guestId, data));
      store.dispatch(dataSavedSuccessfully("Data Updated Successfully"));
      // fetchNearestAirport();
    }
  });
}

export function saveGuestWishesandFeedback(data, isWishEnabled) {
  Meteor.call("guest.details.submit", data, (error, response) => {
    if (error) {
      console.log(error);
      store.dispatch(dataSavedSuccessfully(error.error));
    } else {
      store.dispatch(guestWishesAndFeedbackAction(response, isWishEnabled));
      store.dispatch(dataSavedSuccessfully("Data Updated Successfully"));
    }
  });
}

export function saveGuestServiceAppointments(data) {
  Meteor.call("book.bulk_services", data, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      store.dispatch(updateGuestServiceAppointments(data));
      store.dispatch(dataSavedSuccessfully("Slot Updated Successfully"));
    }
  });
}

export function fetchNearestAirport(){
  Meteor.call("guest.fetch.airports", function(error, response) {
    if (error) {
      console.log(error);
    } else {
      store.dispatch(nearestAirportAction(response));
    }
  });
}
export function saveGuestInformationDetails(guestId, data, info){
  return new Promise((resolve, reject) => {
    Meteor.call('guest.details.submit',{guestId: guestId, data: info}, (error, response) => {
      if(error){
        store.dispatch(dataSavedSuccessfully("Server Error. Data Not Updated"));
        console.log(error);
        console.log("Server Error. Data Not Updated");
      }
      else{
        store.dispatch(updateGuestInformationInStore(guestId, data));
        store.dispatch(dataSavedSuccessfully("Data Updated Successfully"));
        resolve(response);
      }
    });
  });
};

export const guestClearPassport = (guestId) => {
  return new Promise((resolve, reject) => {
    Meteor.call('guest.clear.passport', { guestId }, (error, response)=>{
      if(error) reject(error);
      else {
        store.dispatch(dataSavedSuccessfully("Photo ID cleared successfully"));
        resolve(response);
      }
    });
  });
};

export const guestClearVisa = (guestId) => {
  return new Promise((resolve, reject) => {
    Meteor.call('guest.clear.visa', { guestId }, (error, response)=>{
      if(error) reject(error);
      else {
        store.dispatch(dataSavedSuccessfully("Visa photo cleared successfully"));
        resolve(response);
      }
    });
  });
};

export const fetchGuestFamily = (guestId) => {
  return new Promise((resolve, reject) => {
    Meteor.call('fetch.guest.family', guestId, (err,res) =>{
      if(err) reject(err);
      else {
        setTimeout(() => {
          store.dispatch(guestInformationAction(res));
        },100);
        resolve(res);
      }
    });
  });
};

export const uploadPhoto = (info) => {
  var promise = new Promise((resolve, reject) => {
    let opts = {
      file_name: info.fileName,
      file_type: info.type
    };

    Meteor.call('get_signed_url', opts, (error, response) => {
      if(error)  reject(error);
      else {
        uploadFile(response, info,
          (s) => resolve(s),
          (e) => reject(e)
        );
      }
    });
  });
  return promise;
};

export const uploadArrivalTravelPhoto = (photos, callback,updatedGuestDetails) => {
  var i =0;
  var promises = [];
  // for(var i=0; i<photos.length; i++)
  // {
    
  // }
  var resultPromise = multiPhoto(i, photos, promises, callback,updatedGuestDetails);
  
  return resultPromise;
 
  // let pictures = photos.map((photo) => {  
   
  // })
};
export const multiPhoto = (i, photos, promises, callback,updatedGuestDetails) => {
  var promise = new Promise((resolve, reject) => {
    let opts = {
      file_name: photos[i].name,
      file_type: photos[i].type
    };
    Meteor.call('get_signed_url', opts, (error, response) => {
      if(error)  reject(error);
      else {
        // uploadFile(response, photos[i],
        //   (s) => {resolve(s); console.log(s); promises.push(s);
        //   i++;
        //   if(i<photos.length)
        //   {
        //     multiPhoto(i, photos, promises);
        //   }
        // },
        //   (e) => reject(e)
        // );
        sendTravelFile(response, photos[i], (s) => {
          // store.dispatch(dataSavedSuccessfully("Photo uploaded successfully"));
            promises.push(s);
          i++;
           if(i<photos.length)
          {
            multiPhoto(i, photos, promises,callback,updatedGuestDetails);
          }
          else if(i== photos.length)
          {
           callback(promises, updatedGuestDetails);
          }
        }, (e) => {
          store.dispatch(dataSavedSuccessfully("Server Error. Photo not uploaded"));
        });
      }
    });
  });
}
export const saveTravelTickets = (tickets,id,type) =>{
  for(var i=0; i< tickets.length; i++){ 
    Meteor.call('guest.submit.ticket',{guestId: id, ticketUrl: tickets[i], type:type}, (error, response) => {
      if(error){            
        console.log(error);
        store.dispatch(dataSavedSuccessfully("Server Error. Please try after sometime."));
      }
      else{
        console.log(response);
        store.dispatch(dataSavedSuccessfully("Ticket saved successfully"));
      }
    });
  }
}
export const removeTravelTickets = (id,type) => {
  return new Promise((resolve, reject) => {
    Meteor.call('guest.delete.ticket', { guestId:id, type:type }, (error, response)=>{
      if(error){
        reject(error);
        store.dispatch(dataSavedSuccessfully("Server Error. Please try after sometime."));
      }       
      else {
        store.dispatch(dataSavedSuccessfully("Ticket cleared successfully"));
        resolve(response);
      }
    });
  });
}

export const removeDepartureTickets = (tickets,id,type) =>{
  
}

function sendTravelFile(url, imageDetails, onSuccess, onFail) {  
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', url, true)
  xhr.send(imageDetails);
  xhr.onload = () => {
    if (xhr.status == 200) {
      // THIS WILL UPLOAD THE FILE AND THE responseURL has the uploaded files url that needs to be saved to the guest profile
      // the first part of this, that is everything before '?' is the path to the uploaded image.
      // so to get actual path, you would have to do responseURL.split('?')[0];
    //    updatedGuestDetails.photoID=xhr.responseURL.split('?')[0];
    //    store.dispatch(updateGuestInformationInStore(id, updatedGuestDetails));
      var pic=xhr.responseURL.split('?')[0];
      onSuccess(pic);
    }
  }
}
export const uploadDepartureTravelPhoto = (photos) => {
  console.log(photos);
  // let pictures = photos.map((photo) => {  
  //   var promise = new Promise((resolve, reject) => {
  //     let opts = {
  //       file_name: photo.fileName,
  //       file_type: photo.type
  //     };
  //     Meteor.call('get_signed_url', opts, (error, response) => {
  //       if(error)  reject(error);
  //       else {
  //         uploadFile(response, photos,
  //           (s) => {resolve(s); console.log(s);},
  //           (e) => reject(e)
  //         );
  //       }
  //     });
  //   });
  //   return promise;
  // })
};
export const submitGuestDetails = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    Meteor.call('guest.details.submit',{guestId:data.guestId,data: data}, (error, result) => {
      if(error) reject(error);
      else {
        resolve(result);
      }
    });
  });
};

// BOC: UPLOADING GUEST PHOTO
export function uploadPhotoDetails(imageDetails, id, updatedGuestDetails, callback, data){
  let imageUrlOption = {
    file_name: imageDetails.fileName,
    file_type: imageDetails.type
  };
  let photoURL = '';
  Meteor.call('get_signed_url', imageUrlOption, (error, response) => {
    if(!error)  {
      sendFile(response, imageDetails, id, updatedGuestDetails, (s) => {
        // store.dispatch(dataSavedSuccessfully("Photo uploaded successfully"));
        callback(s, updatedGuestDetails);
      }, (e) => {
        store.dispatch(dataSavedSuccessfully("Server Error. Photo not uploaded"));
      });
    }
  });
}

function sendFile(url, imageDetails, id, updatedGuestDetails, onSuccess, onFail) {
  console.log(imageDetails);
    if (!id || id.length < 1) {
      onFail("No guest selected");
    }
  //   // console.log(id);
    const xhr = new XMLHttpRequest();
  xhr.open('PUT', url, true)
  xhr.send(imageDetails);

  xhr.onload = () => {
    if (xhr.status == 200) {
      // THIS WILL UPLOAD THE FILE AND THE responseURL has the uploaded files url that needs to be saved to the guest profile
      // the first part of this, that is everything before '?' is the path to the uploaded image.
      // so to get actual path, you would have to do responseURL.split('?')[0];
    //    updatedGuestDetails.photoID=xhr.responseURL.split('?')[0];
    //    store.dispatch(updateGuestInformationInStore(id, updatedGuestDetails));
        var pic=xhr.responseURL.split('?')[0];
      onSuccess(pic);
    }
  }

  xhr.onerror = () => {
    onFail(xhr);
  };
}
// EOC: UPLOADING GUEST PHOTO

// BOC: UPLOADING GUEST PASSPORT IMAGE
export function uploadPassportPhotoDetails(imageDetails, id, updatedGuestDetails, callback, fileInput){
  let imageUrlOption = {
    file_name: imageDetails.fileName,
    file_type: imageDetails.type
  };
  let photoURL = '';
  Meteor.call('get_signed_url', imageUrlOption, (error, response) => {
    console.log(response);
    if(!error)  {
      sendPassportFile(response, imageDetails, id, updatedGuestDetails, (s) => {
        store.dispatch(dataSavedSuccessfully("Passport Photo uploaded successfully"));
        let photos = (updatedGuestDetails.guestPassportImages && updatedGuestDetails.guestPassportImages.slice()) || [];
        if(updatedGuestDetails.guestPassportImages && updatedGuestDetails.guestPassportImages instanceof Array) {
          photos.push(s);
        } else {
          photos=[s];
        }
        callback(photos, fileInput);
      }, (e) => {
        store.dispatch(dataSavedSuccessfully("Server Error. Photo not uploaded"));
      });
    }
  });
}

function sendPassportFile(url, imageDetails, id, updatedGuestDetails, onSuccess, onFail) {
  console.log(imageDetails);
    if (!id || id.length < 1) {
      onFail("No guest selected");
    }
    const xhr = new XMLHttpRequest();
  xhr.open('PUT', url, true)
  xhr.send(imageDetails);

  xhr.onload = () => {
    if (xhr.status == 200) {
      // THIS WILL UPLOAD THE FILE AND THE responseURL has the uploaded files url that needs to be saved to the guest profile
      // the first part of this, that is everything before '?' is the path to the uploaded image.
      // so to get actual path, you would have to do responseURL.split('?')[0];

        var pic=xhr.responseURL.split('?')[0];
      onSuccess(pic);
    }
  }

  xhr.onerror = () => {
    onFail(xhr);
  };
}
// EOC: UPLOADING GUEST PASSPORT IMAGE

// BOC: UPLOADING GUEST VISA PHOTO
export function uploadVisaPhotoDetails(imageDetails, id, updatedGuestDetails, callback, fileInput){
  let imageUrlOption = {
    file_name: imageDetails.fileName,
    file_type: imageDetails.type
  };
  let photoURL = '';
  Meteor.call('get_signed_url', imageUrlOption, (error, response) => {
    console.log(response);
    if(!error)  {
      sendVisaFile(response, imageDetails, id, updatedGuestDetails, (s) => {
        store.dispatch(dataSavedSuccessfully("Visa photo uploaded successfully"));
        let photos = (updatedGuestDetails.guestVisaImages && updatedGuestDetails.guestVisaImages.slice()) || [];
        if(updatedGuestDetails.guestVisaImages && updatedGuestDetails.guestVisaImages instanceof Array){
          photos.push(s);
        } else {
          photos=[s];
        }
        callback(photos, fileInput);
      }, (e) => {
        store.dispatch(dataSavedSuccessfully("Server Error. Photo not uploaded"));
      });
    }
  });
}

function sendVisaFile(url, imageDetails, id, updatedGuestDetails, onSuccess, onFail) {
  console.log(imageDetails);
    if (!id || id.length < 1) {
      onFail("No guest selected");
    }

    const xhr = new XMLHttpRequest();
  xhr.open('PUT', url, true)
  xhr.send(imageDetails);

  xhr.onload = () => {
    if (xhr.status == 200) {
      // THIS WILL UPLOAD THE FILE AND THE responseURL has the uploaded files url that needs to be saved to the guest profile
      // the first part of this, that is everything before '?' is the path to the uploaded image.
      // so to get actual path, you would have to do responseURL.split('?')[0];
       updatedGuestDetails.photoID=xhr.responseURL.split('?')[0];
       //store.dispatch(updateGuestInformationInStore(id, updatedGuestDetails));
        var pic=xhr.responseURL.split('?')[0];
      onSuccess(pic);
    }
  }

  xhr.onerror = () => {
    onFail(xhr);
  };
}
// EOC: UPLOADING GUEST VISA PHOTO

export function fetchPreferenceDetails(eventId) {
    Meteor.call("event.preferences", eventId, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            store.dispatch(guestPreferenceAction(response));

            // fetchNearestAirport();
        }
    });
}

export function fetchAvailableServices(eventId) {
    Meteor.call("fetch.available.services", eventId, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            store.dispatch(guestAvailableServicesAction(response));

            // fetchNearestAirport();
        }
    });
}

// Insurance 
export function uploadInsurancePhotoDetails(imageDetails, id, updatedGuestDetails, callback, fileInput){
  let imageUrlOption = {
    file_name: imageDetails.fileName,
    file_type: imageDetails.type
  };
  let photoURL = '';
  Meteor.call('get_signed_url', imageUrlOption, (error, response) => {
    console.log(response);
    if(!error)  {
      sendInsuranceFile(response, imageDetails, id, updatedGuestDetails, (s) => {
        store.dispatch(dataSavedSuccessfully("Insurance photo uploaded successfully"));
        let photos = (updatedGuestDetails.guestInsuranceImages && updatedGuestDetails.guestInsuranceImages.slice()) || [];
        if(updatedGuestDetails.guestInsuranceImages && updatedGuestDetails.guestInsuranceImages instanceof Array){
          photos.push(s);
        } else {
          photos=[s];
        }
        callback(photos, fileInput);
      }, (e) => {
        store.dispatch(dataSavedSuccessfully("Server Error. Photo not uploaded"));
      });
    }
  });
}

export const guestClearInsurance = (guestId) => {
  return new Promise((resolve, reject) => {
    Meteor.call('guest.clear.insurance', { guestId }, (error, response)=>{
      if(error) reject(error);
      else {
        store.dispatch(dataSavedSuccessfully("Insurance photo cleared successfully"));
        resolve(response);
      }
    });
  });
};

function sendInsuranceFile(url, imageDetails, id, updatedGuestDetails, onSuccess, onFail) {
  if (!id || id.length < 1) {
    onFail("No guest selected");
  }
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', url, true)
  xhr.send(imageDetails);

  xhr.onload = () => {
    if (xhr.status == 200) {
      updatedGuestDetails.photoID=xhr.responseURL.split('?')[0];
      var pic=xhr.responseURL.split('?')[0];
      onSuccess(pic);
    }
  }
  
  xhr.onerror = () => {
    onFail(xhr);
  };
}