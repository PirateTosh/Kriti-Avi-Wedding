import React from "react";

import {
  saveGuestInformationDetails,
  uploadPhotoDetails,
  uploadPassportPhotoDetails,
  uploadVisaPhotoDetails,
  uploadInsurancePhotoDetails,
  fetchGuestInformation,
} from "../../api/guestInformationApi";

import set from "lodash/set";
import {
  getAppDetails,
  getGuestFamily,
  getGuestInformation,
  getNearestAirportList,
  passportDetailsAvailableOption,
  fetchGenderOption,
  fetchCountry,
  getGuestInfoDetails,
} from "../../selectors";
import { connect } from "react-redux";
import get from "lodash/get";
import Address from "./myAddress";
import cloneDeep from "lodash/cloneDeep";
import $ from "jquery";
import { fetchAppDetails } from "../../api/appDetApi";
import Passport from "./passport";
import Visa from "./visa";
import moment from "moment";
import Loader from "../loader/loader.js";
import Insurance from "./insurance";
class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      defaultGuestId: "",
      guestInformation: "",
      currentGuestBirthday: "",
      photoField: "",
      insuranceInformation: {},
      appDetails: cloneDeep(props.appDetails),
    };
    this.updateGuestDetail = this.updateGuestDetail.bind(this);
    this.saveGuestDetails = this.saveGuestDetails.bind(this);
    this.savePersonalDetails = this.savePersonalDetails.bind(this);
    this.saveAddressDetails = this.saveAddressDetails.bind(this);
    this.saveInsuranceDetails = this.saveInsuranceDetails.bind(this);
    this.openBrowserToSelectPhoto = this.openBrowserToSelectPhoto.bind(this);
    this.uploadPhoto = this.uploadPhoto.bind(this);
    this.getGuestFamilyDetails = this.getGuestFamilyDetails.bind(this);
    this.updateGuestBD = this.updateGuestBD.bind(this);
    this.photoUploadedSuccessFully = this.photoUploadedSuccessFully.bind(this);
  }

  updateGuestBD(date) {
    this.setState({
      currentGuestBirthday: date,
    });
    const dateFormatted = date.format("D MMMM, YYYY");
    this.setState({
      guestInformation: Object.assign({}, this.state.guestInformation, {
        guestDOB: dateFormatted,
      }),
    });
  }

  updateGuestDetail(event) {
    const field = event.target.name;
    let guestInformation = cloneDeep(this.state.guestInformation);
    let insuranceInformation = this.state.insuranceInformation;
    if (event.target.getAttribute("data-type") === "insurance") {
      set(insuranceInformation, field, event.target.value);
      return this.setState({ insuranceInformation: insuranceInformation });
    } else {
      set(guestInformation, field, event.target.value);
      return this.setState({ guestInformation: guestInformation });
    }
  }

  saveGuestDetails(event) {
    event.preventDefault();
    this.setState({ loading: true });
    var self = this;
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    updatedGuestDetails.insuranceInfo = Object.assign(
      {},
      this.state.insuranceInformation
    );
    if (!this.state.photoField) {
      saveGuestInformationDetails(updatedGuestDetails._id, updatedGuestDetails)
        .then(() => {
          this.setState({ loading: false });
        })
        .catch((e) => {
          alert("Upload failed");
          this.setState({ loading: false });
        });
    } else {
      uploadPhotoDetails(
        this.state.photoField,
        updatedGuestDetails._id,
        updatedGuestDetails,
        self.photoUploadedSuccessFully
      );
    }
  }

  savePersonalDetails(event) {
    event.preventDefault();
    this.setState({ loading: true });
    var self = this;
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    updatedGuestDetails.insuranceInfo = Object.assign(
      {},
      this.state.insuranceInformation
    );
    var data = {
      guestTitle: updatedGuestDetails.guestTitle,
      guestFirstName: updatedGuestDetails.guestFirstName,
      guestLastName: updatedGuestDetails.guestLastName,
      guestPersonalEmail: updatedGuestDetails.guestPersonalEmail,
      guestContactNo: updatedGuestDetails.guestContactNo,
      guestDOB: updatedGuestDetails.guestDOB,
      guestGender: updatedGuestDetails.guestGender,
      photoID: updatedGuestDetails.photoID,
    };

    if (!this.state.photoField) {
      saveGuestInformationDetails(
        updatedGuestDetails._id,
        updatedGuestDetails,
        data
      )
        .then(() => {
          this.setState({ loading: false });
        })
        .catch((e) => {
          alert("Upload failed");
          this.setState({ loading: false });
        });
    } else {
      uploadPhotoDetails(
        this.state.photoField,
        updatedGuestDetails._id,
        updatedGuestDetails,
        self.photoUploadedSuccessFully,
        data
      );
    }
  }

  saveAddressDetails(event) {
    event.preventDefault();
    this.setState({ loading: true });
    var self = this;
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    updatedGuestDetails.insuranceInfo = Object.assign(
      {},
      this.state.insuranceInformation
    );
    var data = {
      guestAddress1: updatedGuestDetails.guestAddress1,
      guestAddress2: updatedGuestDetails.guestAddress2,
      guestAddressCity: updatedGuestDetails.guestAddressCity,
      guestAddressState: updatedGuestDetails.guestAddressState,
      guestAddressPincode: updatedGuestDetails.guestAddressPincode,
      guestAddressLandmark: updatedGuestDetails.guestAddressLandmark,
      guestAddressNationality: updatedGuestDetails.guestAddressNationality,
      guestNearestAirport: updatedGuestDetails.guestNearestAirport,
    };
    if (!this.state.photoField) {
      saveGuestInformationDetails(
        updatedGuestDetails._id,
        updatedGuestDetails,
        data
      )
        .then(() => {
          this.setState({ loading: false });
        })
        .catch((e) => {
          alert("Upload failed");
          this.setState({ loading: false });
        });
    } else {
      uploadPhotoDetails(
        this.state.photoField,
        updatedGuestDetails._id,
        updatedGuestDetails,
        self.photoUploadedSuccessFully,
        data
      );
    }
  }

  saveInsuranceDetails(event) {
    event.preventDefault();
    this.setState({ loading: true });
    var self = this;
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    updatedGuestDetails.insuranceInfo = Object.assign(
      {},
      this.state.insuranceInformation
    );
    var data = {
      insuranceInfo: this.state.insuranceInformation,
    };
    if (!this.state.photoField) {
      saveGuestInformationDetails(
        updatedGuestDetails._id,
        updatedGuestDetails,
        data
      )
        .then(() => {
          this.setState({ loading: false });
        })
        .catch((e) => {
          alert("Upload failed");
          this.setState({ loading: false });
        });
    } else {
      uploadPhotoDetails(
        this.state.photoField,
        updatedGuestDetails._id,
        updatedGuestDetails,
        self.photoUploadedSuccessFully,
        data
      );
    }
  }

  // BOC GUEST PHOTO UPLOAD
  uploadPhoto(event) {
    let id = get(event.target, "attributes['id'].value");
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    let that = this;
    let fileInput = $("#" + id);
    fileInput.on("change", function (e) {
      let reader = new FileReader();
      let file = get(fileInput, "[0].files[0]");
      if (file) {
        $(fileInput)
          .parent("div")
          .parent("div")
          .find("button.btnSave")
          .addClass("abl-disabled-btn");
        const response = uploadPhotoDetails(
          file,
          updatedGuestDetails._id,
          updatedGuestDetails,
          that.photoUploadedSuccessFully,
          fileInput
        );
      } else {
        console.log("photo not found");
      }
    });
  }

  photoUploadedSuccessFully(photoId, updatedGuestDetails) {
    updatedGuestDetails.photoID = photoId;
    let thatone = this;
    var data = {
      guestAddress1: updatedGuestDetails.guestAddress1,
      guestAddress2: updatedGuestDetails.guestAddress2,
      guestAddressCity: updatedGuestDetails.guestAddressCity,
      guestAddressState: updatedGuestDetails.guestAddressState,
      guestAddressPincode: updatedGuestDetails.guestAddressPincode,
      guestAddressLandmark: updatedGuestDetails.guestAddressLandmark,
      guestAddressNationality: updatedGuestDetails.guestAddressNationality,
      guestNearestAirport: updatedGuestDetails.guestNearestAirport,
      photoID: photoId,
    };

    saveGuestInformationDetails(
      updatedGuestDetails._id,
      updatedGuestDetails,
      data
    )
      .then(() => {
        thatone.setState({ loading: false });
      })
      .catch((e) => {
        alert("Upload failed");
        thatone.setState({ loading: false });
      });
    thatone.setState({
      photoField: "",
    });
    if (photoId) {
      thatone.setState({
        guestInformation: Object.assign({}, this.state.guestInformation, {
          photoID: photoId,
        }),
      });
    } else {
      thatone.setState({
        guestInformation: Object.assign({}, this.state.guestInformation, {
          photoID: "",
        }),
      });
    }
  }

  // BOC GUEST VISA PHOTO UPLOAD
  uploadVisaPhoto() {
    let id = "visaImage";
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    let that = this;
    let fileInput = $("#" + id);
    if ($("#visaImage").val()) {
      $("#visaPhotoLabel").show();
      var filename = $("#visaImage").val().split("\\").pop();
      if (filename && filename.length) {
        if (filename.length > 20) {
          filename = "..." + filename.substring(filename.length - 20);
        }
        $("#visaPhotoLabel span").html(filename);
      } else {
        $("#visaPhotoLabel span").html("File Selected");
      }
      let reader = new FileReader();
      let file = get(fileInput, "[0].files[0]");
      if (file) {
        $(fileInput)
          .parent("div")
          .parent("div")
          .find("button.btnSave")
          .addClass("abl-disabled-btn");
        const response = uploadVisaPhotoDetails(
          file,
          updatedGuestDetails._id,
          updatedGuestDetails,
          that.visaPhotoUploadedSuccessFully,
          fileInput
        );
      } else {
      }
    }
  }

  visaPhotoUploadedSuccessFully(photoId, fileInput) {
    $(fileInput)
      .parent("div")
      .parent("div")
      .find("button.btnSave")
      .removeClass("abl-disabled-btn");
    if (photoId) {
      this.setState({
        guestInformation: Object.assign({}, this.state.guestInformation, {
          guestVisaImages: photoId,
        }),
      });
    } else {
      this.setState({
        guestInformation: Object.assign({}, this.state.guestInformation, {
          guestVisaImages: [],
        }),
      });
    }
  }
  // EOC GUEST VISA PHOTO UPLOAD

  // BOC GUEST insurance PHOTO UPLOAD
  uploadInsurancePhoto() {
    let id = "insuranceImage";
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    let that = this;
    let fileInput = $("#" + id);
    if ($("#insuranceImage").val()) {
      $("#insurancePhotoLabel").show();
      var filename = $("#insuranceImage").val().split("\\").pop();
      if (filename && filename.length) {
        if (filename.length > 20) {
          filename = "..." + filename.substring(filename.length - 20);
        }
        $("#insurancePhotoLabel span").html(filename);
      } else {
        $("#insurancePhotoLabel span").html("File Selected");
      }
      let reader = new FileReader();
      let file = get(fileInput, "[0].files[0]");
      if (file) {
        $(fileInput)
          .parent("div")
          .parent("div")
          .find("button.btnSave")
          .addClass("abl-disabled-btn");
        const response = uploadInsurancePhotoDetails(
          file,
          updatedGuestDetails._id,
          updatedGuestDetails,
          that.insurancePhotoUploadedSuccessFully,
          fileInput
        );
      } else {
      }
    }
  }

  insurancePhotoUploadedSuccessFully(photoId, fileInput) {
    $(fileInput)
      .parent("div")
      .parent("div")
      .find("button.btnSave")
      .removeClass("abl-disabled-btn");
    if (photoId) {
      this.setState({
        guestInformation: Object.assign({}, this.state.guestInformation, {
          guestInsuranceImages: photoId,
        }),
      });
    } else {
      this.setState({
        guestInformation: Object.assign({}, this.state.guestInformation, {
          guestInsuranceImages: [],
        }),
      });
    }
  }

  // EOC GUEST insurance PHOTO UPLOAD
  getGuestFamilyDetails(event) {
    $("button.btnSave").removeClass("abl-disabled-btn");
    event.preventDefault();
    this.setState({
      currentGuestBirthday: "",
      insuranceInformation: {},
    });
    let id = get(event.target, "attributes['id'].value");
    let data =
      this.props.guestInformation &&
      this.props.guestInformation.filter((data) => {
        if (data._id === id) {
          return data;
        }
      });
    return this.setState({
      guestInformation: Object.assign({}, data[0], {
        insuranceInformation: {},
      }),
    });
  }

  getGuestToRender(defaultGuestDetails) {
    let returnData = {};
    if (this.state.guestInformation === "") {
      this.setState({ guestInformation: defaultGuestDetails[0] });
      return defaultGuestDetails[0];
    } else {
      let changeGuestFamily =
        this.props.guestInformation &&
        this.props.guestInformation.filter((data) => {
          let guest = this.state.guestInformation;
          if (data._id === guest._id) {
            returnData = Object.assign({}, data, guest);
            returnData.insuranceInformation = Object.assign(
              {},
              data.insuranceInformation,
              guest.insuranceInformation
            );
            return returnData;
          }
        });
      return returnData || changeGuestFamily[0];
    }
  }

  openBrowserToSelectPhoto(event) {
    let id = get(event.target, "attributes['name'].value");
    $("#" + id).click();
  }

  clearPhotoID() {
    this.setState({
      photoField: "",
    });
    this.setState({
      guestInformation: Object.assign({}, this.state.guestInformation, {
        photoID: "",
      }),
    });
  }

  componentDidMount() {
    $("body").addClass("additionalBG");
  }

  render() {
    $(".backIcon").show();
    $(".backIconMobile").show();
    const { appDetails } = this.state;
    let appdata = this.state.appDetails;
    const {
      list,
      guestFamily,
      guestInformation,
      nearestAirportList,
      appSettings,
    } = this.props;
    let genderList = fetchGenderOption();
    let countryList = fetchCountry();
    let visaQuestion = this.props.guestInfoOptions.visaQuestion;
    let photoIDQuestion = this.props.guestInfoOptions.photoIDQuestion;
    let defaultGuest =
      guestInformation && this.getGuestToRender(guestInformation);
    if (typeof defaultGuest == "undefined") {
      defaultGuest = [];
    }

    const defaultGuestBirthday = moment(
      this.state.currentGuestBirthday ||
        new Date(defaultGuest && defaultGuest.guestDOB)
    );
    let photo =
      defaultGuest && defaultGuest.photoID && defaultGuest.photoID != "";

    return (
      <div>
        {this.state.loading ? <Loader /> : null}

        {appdata &&
          appdata.appDetails &&
          appdata.appDetails.selectedAppGuestInfo &&
          appdata.appDetails.selectedAppGuestInfo.map((list) => {
            if (list === "guestVisaInfo") {
              return guestFamily && guestFamily.length > 0 ? (
                <Visa
                  guestFamilyDetails={defaultGuest}
                  setLoading={(loading) => {
                    this.setState({
                      loading,
                    });
                  }}
                  familyMember={guestFamily}
                  appSettings={appSettings}
                  getGuestFamilyDetail={this.getGuestFamilyDetails}
                  saveDetails={this.saveGuestDetails}
                  familyMember={guestFamily}
                  openFolder={this.openBrowserToSelectPhoto}
                  visaQuestion={visaQuestion}
                  uploadVisaImage={this.uploadVisaPhoto.bind(this)}
                />
              ) : null;
            }
          })}
        {appdata &&
          appdata.appDetails &&
          appdata.appDetails.selectedAppGuestInfo &&
          appdata.appDetails.selectedAppGuestInfo.map((list) => {
            if (list === "guestInsuranceInfo") {
              return guestFamily && guestFamily.length > 0 ? (
                <Insurance
                  guestFamilyDetails={defaultGuest}
                  setLoading={(loading) => {
                    this.setState({
                      loading,
                    });
                  }}
                  familyMember={guestFamily}
                  appSettings={appSettings}
                  getGuestFamilyDetail={this.getGuestFamilyDetails}
                  saveDetails={this.saveGuestDetails}
                  familyMember={guestFamily}
                  enableInsurance={this.enableInsurance}
                  disableInsurance={this.disableInsurance}
                  openFolder={this.openBrowserToSelectPhoto}
                  uploadInsuranceImage={this.uploadInsurancePhoto.bind(this)}
                />
              ) : null;
            }
          })}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    guestInformation: getGuestInformation(state),
    guestFamily: getGuestFamily(state),
    nearestAirportList: getNearestAirportList(state),
    appSettings: state.appConfigReducer.appSettings,
    appDetails: getAppDetails(state),
    guestInfoOptions: getGuestInfoDetails(state),
  };
}
export default connect(mapStateToProps)(Details);
