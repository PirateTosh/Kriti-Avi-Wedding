import React from "react";
import DatePicker from 'react-datepicker';
import { saveGuestInformationDetails, uploadPhotoDetails, uploadPassportPhotoDetails, uploadVisaPhotoDetails, uploadInsurancePhotoDetails, fetchGuestInformation } from "../../api/guestInformationApi";
import { fetchAppSettings } from "../../api/appDetApi.js";
import set from "lodash/set";
import { getAppDetails, getGuestId, getGuestFamily, getGuestInformation, getNearestAirportList, passportDetailsAvailableOption, fetchGenderOption, fetchCountry, getGuestInfoDetails } from "../../selectors";
import { connect } from "react-redux";
import get from "lodash/get";
import Address from "./myAddress";
import cloneDeep from "lodash/cloneDeep";
import $ from "jquery";
import { fetchAppDetails } from "../../api/appDetApi"
import Passport from "./passport";
import Visa from "./visa";
import moment from "moment";
import Loader from '../loader/loader.js';
import Insurance from './insurance';
class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      defaultGuestId: "",
      guestInformation: '',
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
      currentGuestBirthday: date
    });
    const dateFormatted = date.format("D MMMM, YYYY");
    this.setState({ guestInformation: Object.assign({}, this.state.guestInformation, { 'guestDOB': dateFormatted }) });
  }

  updateGuestDetail(event) {
    const field = event.target.name;
    let guestInformation = cloneDeep(this.state.guestInformation);
    let insuranceInformation = this.state.insuranceInformation;
    if (event.target.getAttribute('data-type') === 'insurance') {
      set(insuranceInformation, field, event.target.value);
      return this.setState({ insuranceInformation: insuranceInformation });
    }
    else {
      set(guestInformation, field, event.target.value);
      return this.setState({ guestInformation: guestInformation });
    }
  }

  saveGuestDetails(event) {
    event.preventDefault();
    this.setState({ loading: true });
    var self = this;
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    updatedGuestDetails.insuranceInfo = Object.assign({}, this.state.insuranceInformation);
    if (!this.state.photoField) {
      saveGuestInformationDetails(updatedGuestDetails._id, updatedGuestDetails).then(() => {
        this.setState({ loading: false });
      }).catch(e => {
        alert("Upload failed");
        this.setState({ loading: false });
      });
    } else {
      uploadPhotoDetails(this.state.photoField, updatedGuestDetails._id, updatedGuestDetails, self.photoUploadedSuccessFully);
    }
  }

  savePersonalDetails(event) {
    event.preventDefault();
    this.setState({ loading: true });
    var self = this;
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    updatedGuestDetails.insuranceInfo = Object.assign({}, this.state.insuranceInformation);
    var data = {
      guestTitle: updatedGuestDetails.guestTitle,
      guestFirstName: updatedGuestDetails.guestFirstName,
      guestLastName: updatedGuestDetails.guestLastName,
      guestPersonalEmail: updatedGuestDetails.guestPersonalEmail,
      guestContactNo: updatedGuestDetails.guestContactNo,
      guestDOB: updatedGuestDetails.guestDOB,
      guestGender: updatedGuestDetails.guestGender,
      photoID: updatedGuestDetails.photoID
    };

    if (!this.state.photoField) {
      saveGuestInformationDetails(updatedGuestDetails._id, updatedGuestDetails, data).then(() => {
        this.setState({ loading: false });
      }).catch(e => {
        alert("Upload failed");
        this.setState({ loading: false });
      });
    } else {
      uploadPhotoDetails(this.state.photoField, updatedGuestDetails._id, updatedGuestDetails, self.photoUploadedSuccessFully, data);
    }
  }

  saveAddressDetails(event) {
    event.preventDefault();
    this.setState({ loading: true });
    var self = this;
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    updatedGuestDetails.insuranceInfo = Object.assign({}, this.state.insuranceInformation);
    var data = {
      guestAddress1: updatedGuestDetails.guestAddress1,
      guestAddress2: updatedGuestDetails.guestAddress2,
      guestAddressCity: updatedGuestDetails.guestAddressCity,
      guestAddressState: updatedGuestDetails.guestAddressState,
      guestAddressPincode: updatedGuestDetails.guestAddressPincode,
      guestAddressLandmark: updatedGuestDetails.guestAddressLandmark,
      guestAddressNationality: updatedGuestDetails.guestAddressNationality,
      guestNearestAirport: updatedGuestDetails.guestNearestAirport
    };
    if (!this.state.photoField) {
      saveGuestInformationDetails(updatedGuestDetails._id, updatedGuestDetails, data).then(() => {
        this.setState({ loading: false });
      }).catch(e => {
        alert("Upload failed");
        this.setState({ loading: false });
      });
    } else {
      uploadPhotoDetails(this.state.photoField, updatedGuestDetails._id, updatedGuestDetails, self.photoUploadedSuccessFully, data);
    }
  }

  saveInsuranceDetails(event) {
    event.preventDefault();
    this.setState({ loading: true });
    var self = this;
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    updatedGuestDetails.insuranceInfo = Object.assign({}, this.state.insuranceInformation);
    var data = {
      insuranceInfo: this.state.insuranceInformation
    };
    if (!this.state.photoField) {
      saveGuestInformationDetails(updatedGuestDetails._id, updatedGuestDetails, data).then(() => {
        this.setState({ loading: false });
      }).catch(e => {
        alert("Upload failed");
        this.setState({ loading: false });
      });
    } else {
      uploadPhotoDetails(this.state.photoField, updatedGuestDetails._id, updatedGuestDetails, self.photoUploadedSuccessFully, data);
    }
  }

  // BOC GUEST PHOTO UPLOAD
  uploadPhoto(event) {
    let id = get(event.target, "attributes['id'].value");
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    let that = this;
    let fileInput = $("#" + id);
    fileInput.on('change', function (e) {
      let reader = new FileReader();
      let file = get(fileInput, "[0].files[0]");
      if (file) {
        $(fileInput).parent('div').parent('div').find('button.btnSave').addClass('abl-disabled-btn');
        const response = uploadPhotoDetails(file, updatedGuestDetails._id, updatedGuestDetails, that.photoUploadedSuccessFully, fileInput);
      } else {
        console.log('photo not found');
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
      photoID: photoId
    };

    saveGuestInformationDetails(updatedGuestDetails._id, updatedGuestDetails, data).then(() => {
      thatone.setState({ loading: false });
    }).catch(e => {
      alert("Upload failed");
      thatone.setState({ loading: false });
    });
    thatone.setState({
      photoField: ''
    });
    if (photoId) {
      thatone.setState({ guestInformation: Object.assign({}, this.state.guestInformation, { 'photoID': photoId }) });
    } else {
      thatone.setState({ guestInformation: Object.assign({}, this.state.guestInformation, { 'photoID': '' }) });
    }
  }

  // BOC GUEST VISA PHOTO UPLOAD
  uploadVisaPhoto() {
    let id = 'visaImage';
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    let that = this;
    let fileInput = $("#" + id);
    if ($('#visaImage').val()) {
      $('#visaPhotoLabel').show();
      var filename = $('#visaImage').val().split('\\').pop();
      if (filename && filename.length) {
        if (filename.length > 20) {
          filename = "..." + filename.substring(filename.length - 20);
        }
        $('#visaPhotoLabel span').html(filename);
      } else {
        $('#visaPhotoLabel span').html('File Selected');
      }
      let reader = new FileReader();
      let file = get(fileInput, "[0].files[0]");
      if (file) {
        $(fileInput).parent('div').parent('div').find('button.btnSave').addClass('abl-disabled-btn');
        const response = uploadVisaPhotoDetails(file, updatedGuestDetails._id, updatedGuestDetails, that.visaPhotoUploadedSuccessFully, fileInput);
      } else {

      }
    }
  }

  visaPhotoUploadedSuccessFully(photoId, fileInput) {
    $(fileInput).parent('div').parent('div').find('button.btnSave').removeClass('abl-disabled-btn');
    if (photoId) {
      this.setState({ guestInformation: Object.assign({}, this.state.guestInformation, { 'guestVisaImages': photoId }) });
    } else {
      this.setState({ guestInformation: Object.assign({}, this.state.guestInformation, { 'guestVisaImages': [] }) });
    }
  }
  // EOC GUEST VISA PHOTO UPLOAD

  // BOC GUEST insurance PHOTO UPLOAD
  uploadInsurancePhoto() {
    let id = 'insuranceImage';
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    let that = this;
    let fileInput = $("#" + id);
    if ($('#insuranceImage').val()) {
      $('#insurancePhotoLabel').show();
      var filename = $('#insuranceImage').val().split('\\').pop();
      if (filename && filename.length) {
        if (filename.length > 20) {
          filename = "..." + filename.substring(filename.length - 20);
        }
        $('#insurancePhotoLabel span').html(filename);
      } else {
        $('#insurancePhotoLabel span').html('File Selected');
      }
      let reader = new FileReader();
      let file = get(fileInput, "[0].files[0]");
      if (file) {
        $(fileInput).parent('div').parent('div').find('button.btnSave').addClass('abl-disabled-btn');
        const response = uploadInsurancePhotoDetails(file, updatedGuestDetails._id, updatedGuestDetails, that.insurancePhotoUploadedSuccessFully, fileInput);
      } else {

      }
    }
  }

  insurancePhotoUploadedSuccessFully(photoId, fileInput) {
    $(fileInput).parent('div').parent('div').find('button.btnSave').removeClass('abl-disabled-btn');
    if (photoId) {
      this.setState({ guestInformation: Object.assign({}, this.state.guestInformation, { 'guestInsuranceImages': photoId }) });
    } else {
      this.setState({ guestInformation: Object.assign({}, this.state.guestInformation, { 'guestInsuranceImages': [] }) });
    }
  }

  // EOC GUEST insurance PHOTO UPLOAD
  getGuestFamilyDetails(event) {
    $('button.btnSave').removeClass('abl-disabled-btn');
    event.preventDefault();
    this.setState({
      "currentGuestBirthday": "",
      "insuranceInformation": {}
    });
    let id = get(event.target, "attributes['id'].value");
    let data = this.props.guestInformation && this.props.guestInformation.filter(data => {
      if (data._id === id) {
        return data;
      }
    });
    return this.setState({
      guestInformation: Object.assign({}, data[0], { 'insuranceInformation': {} })
    });
  }

  getGuestToRender(defaultGuestDetails) {
    let returnData = {};
    if (this.state.guestInformation === '') {
      this.setState({ guestInformation: defaultGuestDetails[0] });
      return defaultGuestDetails[0];
    }
    else {
      let changeGuestFamily = this.props.guestInformation && this.props.guestInformation.filter(data => {
        let guest = this.state.guestInformation;
        if (data._id === guest._id) {
          returnData = Object.assign({}, data, guest);
          returnData.insuranceInformation = Object.assign({}, data.insuranceInformation, guest.insuranceInformation);
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
      photoField: ''
    });
    this.setState({ guestInformation: Object.assign({}, this.state.guestInformation, { 'photoID': '' }) });
  }

  componentDidMount() {

  }

  render() {
    $('.backIcon').show();
    $('.backIconMobile').show();
    const { appDetails } = this.state;
    let appdata = this.state.appDetails;
    const { list, guestFamily, guestInformation, nearestAirportList, appSettings } = this.props;
    let genderList = fetchGenderOption();
    let countryList = fetchCountry();
    let visaQuestion = this.props.guestInfoOptions.visaQuestion;
    let photoIDQuestion = this.props.guestInfoOptions.photoIDQuestion;
    let defaultGuest = guestInformation && this.getGuestToRender(guestInformation);
    if (typeof defaultGuest == 'undefined') {
      defaultGuest = [];
    }

    const defaultGuestBirthday = moment(this.state.currentGuestBirthday || new Date(defaultGuest && defaultGuest.guestDOB));
    let photo = defaultGuest && defaultGuest.photoID && defaultGuest.photoID != "";

    return (
      <div>
        {this.state.loading ? <Loader /> : null}

        {appdata && appdata.appDetails && appdata.appDetails.selectedAppGuestInfo && appdata.appDetails.selectedAppGuestInfo.map(x => {
          if (x === "guestDetails") {
            return (
              <div className="informationScreenDivides appBodyFontFamily">
                <div className="card-header myInformation-card-header appBodyFontColor appGradientColor  collapsed" data-toggle="collapse" href="#MEAL PREFERENCES">
                  <a className="card-title">
                    <i className="icon-my-details" aria-hidden="true" />  MY DETAILS<i className="fa dynamicAdd" aria-hidden="true" />
                  </a>
                </div>
                <div id="MEAL PREFERENCES" className="card-body myInformation-card-body appGradientColor collapse" data-parent="#accordion" >
                  <div className="row">
                    <div className="myPassportBtnTop">
                      {guestFamily && guestFamily.map(guest => {
                        return <button className={`btn btn-default btn-responsive ankur appBodyFontFamily appBodyFontColor ${(guest.guestId === defaultGuest._id) ? "active" : ""}`} key={guest.guestId} id={guest.guestId} onClick={this.getGuestFamilyDetails.bind(this)}>{guest.guestName}</button>
                      })}
                    </div>
                  </div>
                  {defaultGuest &&
                    <div>
                      <div className="row">
                        <div className="col-md-6">
                          <select className="form-control form-control-color appBodyFontFamily appBodyFontColor" data-live-search="true" data-size="10" id={defaultGuest._id}
                            onChange={this.updateGuestDetail.bind(this)} value={defaultGuest.guestTitle ? defaultGuest.guestTitle : null} name="guestTitle" >
                            <option disabled value="">Select Title</option>
                            {list && list.map((item) => {
                              return <option key={item.id} value={item.name}>{item.name}</option>;
                            })}
                          </select>
                        </div>
                        <div className="col-md-6"></div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <input className="form-control form-control-color appBodyFontFamily appBodyFontColor" placeholder="NAME" onChange={this.updateGuestDetail.bind(this)} name="guestFirstName" type="Text" value={defaultGuest.guestFirstName} id="guestFirstName"  tabIndex="1" />
                          <span id="ErrorName" style={{ color: 'white' }} />
                        </div>
                        <div className="col-md-6">
                          <input type="text" className="form-control form-control-color appBodyFontColor" id="Lnameid" placeholder="LAST NAME" value={defaultGuest.guestLastName} name="guestLastName"  onChange={this.updateGuestDetail.bind(this)} />
                          <span id="ErrorLName" style={{ color: 'white' }} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <input type="text" className="form-control form-control-color appBodyFontFamily appBodyFontColor" id="numberid" placeholder="MOBILE" value={defaultGuest.guestContactNo} name="guestContactNo"  onChange={this.updateGuestDetail.bind(this)} />
                          <span id="NumberError" style={{ color: 'white' }} />
                        </div>
                        <div className="col-md-6">
                          <input readOnly type="email" className="form-control form-control-color appBodyFontFamily appBodyFontColor" id="emailid" aria-describedby="emailHelp" placeholder="EMAIL" name="guestPersonalEmail" value={defaultGuest.guestPersonalEmail}  onChange={this.updateGuestDetail.bind(this)} />
                          <span id="ErrorEmail" style={{ color: 'white' }} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <DatePicker className="form-control form-control-color appBodyFontFamily appBodyFontColor"
                            selected={(defaultGuestBirthday && defaultGuestBirthday._isValid) ? defaultGuestBirthday : null}
                            placeholderText="Select date of birth"
                            onChange={this.updateGuestBD}
                            readOnly={true}
                            calendarClassName="rasta-stripes"
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            showDisabledMonthNavigation
                            maxDate={moment()}
                            dateFormat="DD-MM-YYYY"
                            dropdownMode="select"
                          />
                        </div>
                        <div className="col-md-6">
                          <select className="form-control form-control-color appBodyFontFamily appBodyFontColor" data-live-search="true" data-size="10" id={defaultGuest._id}
                            onChange={this.updateGuestDetail.bind(this)} value={defaultGuest.guestGender} name="guestGender" placeholder="Gender">
                            <option value="" disabled>Select Gender</option>
                            {genderList && genderList.map((item) => {
                              return <option key={item.id} value={item.id}>{item.name}</option>;
                            })}
                          </select>
                        </div>
                      </div>
                      {this.state.photoField || photo ? <div className="row"> <label className="btn-bs-file myInformationBtn ankur appBodyFontFamily appBodyFontColor active abl-filename" id="visaPhotoLabel" ><span>File Selected</span>&nbsp;&nbsp;<i className="fa fa-trash-o clear-img-icon" onClick={this.clearPhotoID.bind(this)}></i></label></div> : null}
                      {this.state.photoField || photo ? null :
                        <div className="row">
                          <label className="btn-bs-file Myaddress-btn-bs-file myInformationBtn" id="photoLabel" name="photoFile" onClick={() => {
                            this.refs.photoUpload.click();
                          }}>UPLOAD Photo</label>
                          <input type="file" tabIndex="0" id="photoFile" accept="image/*" ref="photoUpload" className="myInformationBtn" style={{ display: 'none' }} onChange={(e) => {
                            this.setState({
                              photoField: e.target.files[0]
                            });
                          }} />
                          <br />
                        </div>
                      }
                      <div className="row">
                        <div className="update-info">Please click save button to save your changes.</div>
                        <button className="myInformationBtn appBodyFontFamily appBodyFontColor btnSave" onClick={this.savePersonalDetails.bind(this)}>Save</button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            );
          }
        })}
        {appdata && appdata.appDetails && appdata.appDetails.selectedAppGuestInfo && appdata.appDetails.selectedAppGuestInfo.map(list => {
          if (list === "guestAddress") {
            return (
              <Address guestFamilyDetails={defaultGuest} familyMember={guestFamily} getGuestFamilyDetail={this.getGuestFamilyDetails} guestDetailHandler={this.updateGuestDetail} airportList={nearestAirportList} countryList={countryList} saveDetails={this.saveAddressDetails} />
            );
          }
        })}
        {appdata && appdata.appDetails && appdata.appDetails.selectedAppGuestInfo && appdata.appDetails.selectedAppGuestInfo.map(list => {
          if (list === "guestPhotoID") {
            return (
              guestFamily && guestFamily.length > 0 ? <Passport setLoading={(loading) => {
                this.setState({
                  loading
                });
              }}
                guestFamilyDetails={defaultGuest} guestDetailHandler={this.updateGuestDetail} familyMember={guestFamily} photoIDQuestion={photoIDQuestion} getGuestFamilyDetail={this.getGuestFamilyDetails} appSettings={appSettings} /> : null
            );
          }
        })}
        {appdata && appdata.appDetails && appdata.appDetails.selectedAppGuestInfo && appdata.appDetails.selectedAppGuestInfo.map(list => {
          if (list === "guestVisaInfo") {
            return (
              guestFamily && guestFamily.length > 0 ? <Visa guestFamilyDetails={defaultGuest} setLoading={(loading) => {
                this.setState({
                  loading
                });
              }}
                familyMember={guestFamily} appSettings={appSettings} getGuestFamilyDetail={this.getGuestFamilyDetails} saveDetails={this.saveGuestDetails} familyMember={guestFamily} openFolder={this.openBrowserToSelectPhoto} visaQuestion={visaQuestion} uploadVisaImage={this.uploadVisaPhoto.bind(this)} /> : null
            );
          }
        })}
        {appdata && appdata.appDetails && appdata.appDetails.selectedAppGuestInfo && appdata.appDetails.selectedAppGuestInfo.map(list => {
          if (list === "guestInsuranceInfo") {
            return (
              guestFamily && guestFamily.length > 0 ? <Insurance guestFamilyDetails={defaultGuest} setLoading={(loading) => {
                this.setState({
                  loading
                });
              }}
                familyMember={guestFamily} appSettings={appSettings} getGuestFamilyDetail={this.getGuestFamilyDetails} saveDetails={this.saveGuestDetails} familyMember={guestFamily} enableInsurance={this.enableInsurance} disableInsurance={this.disableInsurance} openFolder={this.openBrowserToSelectPhoto} uploadInsuranceImage={this.uploadInsurancePhoto.bind(this)} /> : null
            );
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
    guestInfoOptions: getGuestInfoDetails(state)
  }
}
export default connect(mapStateToProps)(Details);