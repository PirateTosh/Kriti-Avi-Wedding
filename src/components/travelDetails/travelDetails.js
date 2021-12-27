import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-web-meteor';
import { fetchGuestFamily, uploadArrivalTravelPhoto, uploadDepartureTravelPhoto, submitGuestDetails, guestClearPassport } from '../../api/guestInformationApi.js';
import { getGuestId, getGuestFamily, getGuestInformation } from "../../selectors";
import { fetchGuestInformation, saveTravelTickets, removeTravelTickets, removeDepartureTickets } from "../../api/guestInformationApi";
import './travelDetails.css';
import '../../config/config.js';
import '../common.css';
import $ from 'jquery';
import { checkIsUserLoggedIn } from '../../api/storageAPI';
import { browserHistory } from "react-router";
import { isMobile, AppTItle, AppShortName } from '../../config/config.js';
import { confirmBox } from '../confirmContent/confirmFile';
import { connect } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import Loader from '../loader/loader.js';
import get from "lodash/get";
const maxLength = 9;
const smallName = (name) => {
  if (name.length > maxLength) {
    return name.substring(0, maxLength - 3) + '...';
  }
  return name;
};

class TravelDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      arrivalTickets: null,
      departureTickets: null,
      guestInformation: cloneDeep(props.guestInformation),
    };
    if (!navigator.onLine) {
      //console.log("offline");
      confirmBox();
    }
    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
      //console.log('::: NOT LOGGED IN :::');
      browserHistory.push("/");
    }
    this.getArrivalTickets = this.getArrivalTickets.bind(this);
    this.getDepartureTickets = this.getDepartureTickets.bind(this);
    this.clearArrivalTickets = this.clearArrivalTickets.bind(this);
    this.clearDepartureTickets = this.clearDepartureTickets.bind(this);
    this.getGuestFamilyDetails = this.getGuestFamilyDetails.bind(this);
  }

  componentDidMount() {
    this.sessionEventId = localStorage.getItem('eventId');
    this.sessionGuestId = localStorage.getItem('guestId');
    fetchGuestInformation(this.props.guestId || this.sessionGuestId, false);
    $('html').scrollTop(0);
    if (isMobile) {
      $("#spanHeaderText").html("Travel Details");
      $(".notificationBell").show();
      $(".appLogo").hide()
      $(".chat").show();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.guestInformation !== nextProps.guestInformation) {
      //console.log(this.props.guestInformation);
      let guestInformation = cloneDeep(nextProps.guestInformation);
      guestInformation && guestInformation.filter((gt) => {
        if (gt._id === (this.props.guestInformation && this.props.guestInformation._id)) {
          return gt;
        }
      });
      this.setState({ guestInformation: guestInformation[0] });
    }
  }
  saveTickets() {

    if (!this.state.arrivalTickets && !this.state.departureTickets) {
      alert("Please select at least one picture");
      return;
    }
    if (this.state.arrivalTickets) {
      this.saveArrivalTickets();
    }
    if (this.state.departureTickets) {
      this.saveDepartureTickets();
    }
  }
  clearTickets() {
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    let arrivalTickets = updatedGuestDetails.TicketsArrival;
    let departureTickets = updatedGuestDetails.TicketsDeparture;
    if (typeof arrivalTickets == "undefined") {
      arrivalTickets = [];
    }

    if (typeof departureTickets == "undefined") {
      departureTickets = [];
    }
    if (arrivalTickets.length > 0)
      this.clearArrivalTickets();
    if (departureTickets.length > 0)
      this.clearDepartureTickets();
  }
  saveArrivalTickets() {
    //console.log('arrival', this.state.arrivalTickets);
    this.setState({ loading: true });
    let arrivalArr;
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    let self = this;
    uploadArrivalTravelPhoto(this.state.arrivalTickets, self.getArrivalTickets, updatedGuestDetails);
  }
  clearArrivalTickets() {
    this.setState({ loading: true });
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    removeTravelTickets(updatedGuestDetails._id, "arrival").then(() => {
      this.setState({ loading: false });
      this.setState({ guestInformation: Object.assign({}, this.state.guestInformation, { 'TicketsArrival': [] }), arrivalTickets: null });
    }).catch(er => {
      this.setState({ loading: false });
    });
    let arrivalTickets = [];
    this.setState({
      arrivalTickets: null
    });
  }

  clearDepartureTickets() {
    this.setState({ loading: true });
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    removeTravelTickets(updatedGuestDetails._id, "departure").then(() => {
      this.setState({ loading: false });
      this.setState({ guestInformation: Object.assign({}, this.state.guestInformation, { 'TicketsDeparture': [] }), departureTickets: null });
    }).catch(er => {
      this.setState({ loading: false });
    });
    let departureTickets = [];
    this.setState({
      departureTickets: null
    });
  }
  getArrivalTickets(tickets, updatedGuestDetails) {
    let id = updatedGuestDetails._id;
    //console.log(id);
    console.log(tickets);
    saveTravelTickets(tickets, id, 'arrival');
    this.setState({ loading: false });
    this.setState({ guestInformation: Object.assign({}, this.state.guestInformation, { 'TicketsArrival': tickets }), arrivalTickets: tickets });
    //console.log(this.state.guestInformation);
  }
  saveDepartureTickets() {
    //console.log('departure', this.state.departureTickets);
    this.setState({ loading: true });
    let arrivalArr;
    let updatedGuestDetails = Object.assign({}, this.state.guestInformation);
    let self = this;
    uploadArrivalTravelPhoto(this.state.departureTickets, self.getDepartureTickets, updatedGuestDetails);
  }

  getDepartureTickets(tickets, updatedGuestDetails) {
    let id = updatedGuestDetails._id;
    //console.log(id);
    //console.log(tickets); 
    let that = this;
    saveTravelTickets(tickets, id, 'departure');
    this.setState({ loading: false });
    this.setState({ guestInformation: Object.assign({}, this.state.guestInformation, { 'TicketsDeparture': tickets }), departureTickets: tickets });
    //console.log(this.state.guestInformation);
  }
  uploadFileValidation() {
    let file1 = document.getElementById('fileId').value;
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (file1 === '') {
      alert("select a file");
    }
    else if (!allowedExtensions.exec(file1)) {

      alert("Plz upload a file .jpg .jpeg .png .gif");
    }
    else {
      alert("this is correct file");
    }
  }

  uploadFileValidation1() {
    let file1 = document.getElementById('fileId1').value;
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (file1 === '') {
      alert("select a file");
    }
    else if (!allowedExtensions.exec(file1)) {

      alert("Plz upload a file .jpg .jpeg .png .gif");
    }
    else {
      alert("this is correct file");
    }
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
      // return changeGuestFamily[0];
    }
  }
  getGuestFamilyDetails(event) {
    $('button.btnSave').removeClass('abl-disabled-btn');

    event.preventDefault();
    this.setState({
      "currentGuestBirthday": "",
      "insuranceInformation": {}
    });
    let id = get(event.target, "attributes['id'].value");
    //console.log(id);
    let data = this.props.guestInformation && this.props.guestInformation.filter(data => {
      if (data._id === id) {
        return data;
      }
    });
    let arrivalTickets = data[0].TicketsArrival;
    let departureTickets = data[0].TicketsDeparture;
    let arrival = null;
    let departure = null;
    if (typeof arrivalTickets != "undefined" && arrivalTickets.length > 0) {
      arrival = arrivalTickets;
    }
    else
      arrival = null;

    if (typeof departureTickets != "undefined" && departureTickets.length > 0) {
      departure = departureTickets;
    }
    else
      departure = null;
    console.log(data[0]);
    return this.setState({
      guestInformation: Object.assign({}, data[0]), arrivalTickets: arrival, departureTickets: departure
    });
  }
  render() {
    $('.backIcon').show();
    $('.backIconMobile').show();
    const { guestFamily, guestInformation, appSettings } = this.props;
    let defaultGuest = guestInformation && this.getGuestToRender(guestInformation);
    if (typeof defaultGuest == 'undefined') {
      defaultGuest = [];
    }
    let guestInformationDet = guestInformation && this.state.guestInformation;
    //console.log(guestInformation, guestInformationDet);
    let arrivalTickets = defaultGuest && defaultGuest.TicketsArrival;
    let departureTickets = defaultGuest && defaultGuest.TicketsDeparture;
    let arrival = arrivalTickets ? arrivalTickets : [];
    let dept = departureTickets ? departureTickets : [];
    if (typeof arrivalTickets == "undefined") {
      arrivalTickets = [];
    }

    if (typeof departureTickets == "undefined") {
      departureTickets = [];
    }
    console.log("tic", arrivalTickets, departureTickets);
    console.log(this.state.arrivalTickets, arrivalTickets);
    return (
      <div className="container">
        {this.state.loading ? <Loader /> : null}
        <div className="row">
          <div className="col-sm-12">
            <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block">TRAVEL DETAILS </h3>
            <div className="BtnCommon responsiveBtn rsvpWeddingGuestName" style={{ marginTop: '90px' }}>
              <button className="btn appBodyFontFamily appBodyFontColor commonBtnDestination active">FLIGHTs</button>
              {/* <button className="btn appBodyFontFamily appBodyFontColor commonBtnDestination">HOTELS</button> */}
            </div>
          </div>
          <div className="col-sm-12" style={{ marginTop: '20px' }}>
            <div className="appGradientColor appBodyFontColor">
              <p className="BOOKED">I HAVE BOOKED MY TICKETS</p>
              <div className="row">
                <div className="myPassportBtnTop">
                  {guestFamily && guestFamily.map(guest => {
                    return <button className={`btn btn-default btn-responsive ankur appBodyFontFamily appBodyFontColor ${(guest.guestId === defaultGuest._id) ? "active" : ""}`} key={guest.guestId} id={guest.guestId} onClick={this.getGuestFamilyDetails.bind(this)}>{guest.guestName}</button>
                  })}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 travelP">
                  <div className="travelUpload">
                    <p>ARRIVAL</p>
                    <p>ADD TICKET</p>
                    {this.state.arrivalTickets || arrivalTickets.length > 0 ? <label className="btn-bs-file myInformationBtn ankur appBodyFontFamily appBodyFontColor active abl-filename" id="photoLabel" ><span>Arrival Tickets</span></label> : null}
                    {this.state.arrivalTickets || arrivalTickets.length > 0 ? null : <div>
                      <label className="btn-bs-file" style={{ marginTop: '10px' }}>
                        UPLOAD
                      <input type="file" accept="image/*,application/pdf" id="fileId" multiple onChange={(e) => {
                          this.setState({
                            arrivalTickets: e.target.files
                          });
                        }} />
                      </label>
                    </div>}
                  </div>
                </div>
                <div className="col-md-6  travelP">
                  <div className="travelUpload">
                    <p>DEPARTURE</p>
                    <p>ADD TICKET</p>

                    {this.state.departureTickets || departureTickets.length > 0 ? <label className="btn-bs-file myInformationBtn ankur appBodyFontFamily appBodyFontColor active abl-filename" id="photoLabel" ><span>Departure Tickets</span></label> : null}
                    {this.state.departureTickets || departureTickets.length > 0 ? null : <div>
                      <label className="btn-bs-file" style={{ marginTop: '10px' }}>
                        UPLOAD
                  <input type="file" accept="image/*,application/pdf" id="fileId" multiple onChange={(e) => {
                          this.setState({
                            departureTickets: e.target.files
                          });
                        }} />
                      </label>
                    </div>}
                  </div>
                </div>
              </div>

              <div className=" row submit-btn" style={{ marginTop: '30px' }}>
                <button className="myInformationBtn btnSave" id="save-passport-btn" onClick={() => {
                  dept.length > 0 || arrival.length > 0 ? this.clearTickets() : this.saveTickets();
                }}>{dept.length > 0 || arrival.length > 0 ? 'CLEAR' : 'SAVE'}</button>
              </div>
            </div>
            <div className="col-md-2"></div>
          </div>
        </div>
      </div>

    );
  }
}
function mapStateToProps(state) {
  return {
    guestInformation: getGuestInformation(state),
    guestFamily: getGuestFamily(state),
    appSettings: state.appConfigReducer.appSettings
  }
}
export default connect(mapStateToProps)(TravelDetails);