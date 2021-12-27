import React, { Component } from 'react';
import './rsvp.css';
import '../../config/config.js';
import '../../config/config.css';
import '../common.css';
import $ from 'jquery';
import {fetchGuestInformation} from "../../api/guestInformationApi";
import {fetchEventDetails} from "../../api/eventDetailsApi";
import { fetchguestRSVPDetails, submitRsvpDetails, guestRsvpRegistration,guestRsvpCompanionRegistration } from "../../api/guestRSVPApi"
import {getEventId, getGuestId, getGuestInformation, getEventDetails, getRsvpDetails, getLoggedInUserDetails} from "../../selectors";
import {connect} from "react-redux";
import SubEvents from './subEvents';
import RsvpDateExpired from './rsvpDateExpired';
import RsvpConferenceComponent from './rsvpConferenceComponent';
import RsvpRegistration from './rsvpRegistration';
import _ from 'lodash';
import {isMobile, AppTItle, AppShortName} from  '../../config/config.js';
import { browserHistory } from "react-router";
import {checkIsUserLoggedIn} from '../../api/storageAPI';
import {confirmBox} from '../confirmContent/confirmFile';
import cloneDeep from "lodash/cloneDeep";
import moment from 'moment';

class RSVP extends Component {
    constructor(props) {
        super(props);
        this.state = {
          guestId: '',
          eventDetailArr: [],
          subEventArray:[],
          mainEventDetails:[],
          currentEventDate:''
        }
        this.getEventArray = this.getEventArray.bind(this)
        if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
          // console.log('::: NOT LOGGED IN :::');
          browserHistory.push("/");
      }
      this.getSubEventsByGuest=this.getSubEventsByGuest.bind(this);
    }

    componentDidMount() {
      const { guestId } = this.props;
      this.sessionGuestId = localStorage.getItem('guestId');
      const paramsId = guestId || this.sessionGuestId;
      this.setState ({
        guestId: paramsId
      })
      fetchGuestInformation(paramsId, false);
      fetchEventDetails(paramsId, true);
      fetchguestRSVPDetails (paramsId);
      let mainEventDetails=JSON.parse(localStorage.getItem('currentEvent'));
      this.setState({mainEventDetails:mainEventDetails});
      $('.dateRow button.btn:first-child').click();
      if(isMobile){
        // $("#spanHeaderText").html("RSVP");
        $(".notificationBell").show();
        $(".appLogo").hide()
        $(".chat").show();
      }
      $('html').scrollTop(0) ;




    }

    componentWillReceiveProps (nextProps) {
      const { eventDetails } = this.props;
      this.setState ({
        eventDetailArr: nextProps.eventDetails
      })
      $('.dateRow button.btn:first-child').click();
    }

// method to remove duplicate date from an array
    removeDuplicatesDate(arr) {
      let s = new Set(arr);
      let it = s.values();
      return Array.from(it);
    }

// method sort date ascending order
    sortByDateAsc(lhs, rhs)  { return lhs > rhs ? 1 : lhs < rhs ? -1 : 0; }

// method to format a date
    formatDate(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      hours   = hours < 10 ? '0'+hours : hours ;

      minutes = minutes < 10 ? '0'+minutes : minutes;

      var strTime = hours+":"+minutes+ ' ' + ampm;
      return  date.getFullYear()+ "/" + ((date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) :
      (date.getMonth()+1) ) + "/" + (date.getDate() < 10 ? "0"+date.getDate() :
      date.getDate()) + " " + strTime;
    }


    getsubEvents = (event) => {
      const { eventDetails } = this.props;
      const subEvents = eventDetails.filter(data =>  data.subEventDate === event)
      const sortedSubEvents = _.sortBy(subEvents, (inf) => {
        let timeString = inf.subEventDate + " " + inf.subEventStartTime;
        return new moment(timeString, "DD MMMM, YYYYn HH:mma");
      });
      this.setState ({
        eventDetailArr: sortedSubEvents,
        currentEventDate:event
      })
    }

    getSubEventsByGuest = (guest) => {
      // console.log('asdasdsadad',guest);
      fetchEventDetails(guest._id, true);
      fetchguestRSVPDetails (guest._id);
      this.setState ({
        guestId: guest._id
      })
    }

    getEventArray = (data, event) => {
      let params = this.state.subEventArray
      // console.log('201',data);
      // console.log('10101',event);
      params.push({subeventId: event._id,
      status: data.value})
      this.setState({
        subEventArray: params,
        // guestId: event._id
      })
    }

    submitRsvpDetails = () => {

      submitRsvpDetails(this.state.guestId, this.state.subEventArray);
    }

    guestRsvpRegister = (data) => {
      //var registerData=data;
      var guestId=this.state.guestId;
      let registerData = cloneDeep(data);
      guestRsvpRegistration(guestId,registerData);
      var guestData=JSON.parse(localStorage.getItem('currentGuest'));
      // console.log('guestData after register',guestData);

      if(guestData && guestData.canBringCompanion && guestData.canBringCompanion==true){
        $('#rsvpRegisterForm').hide();
        $('#rsvpAsk').show();
        }
        else
        {
      browserHistory.push('/menus');
        }
    }
    rsvpAskYes=()=>{
      $('#rsvpAsk').hide();
      $('#rsvpCompanion').show();
    }
    rsvpAskNo=()=>{

      browserHistory.push('/menus');
    }
    registerRsvpCompanion=(data)=>{
      // console.log('companion registration data!',data);
      var guestId=this.state.guestId;
      let registerData = cloneDeep(data);
      guestRsvpCompanionRegistration(guestId,registerData);
    }

    updateData() {
      // console.log(this);
    }


    render() {

      $('.backIcon').show();
      $('.backIconMobile').show();
      const { guestInformation, eventDetails, rsvpDetails } = this.props;
      const { guestId, eventDetailArr } = this.state
      const rsvpInfo = _.map(rsvpDetails || [], 'rsvpInfo')
      const  eventDate = _.map(eventDetails, 'subEventDate');
      const eventDateArray = this.removeDuplicatesDate(eventDate).sort(this.sortByDateAsc)

      // console.log('current Guest Info',guestInformation);
      // console.log('eventDetailArr info render',eventDetailArr);
      // console.log('guestId from state',guestId);
      var rsvpByDate=this.state.mainEventDetails && this.state.mainEventDetails.basicDetails&& this.state.mainEventDetails.basicDetails.eventRSVPBy;
      var rsvpStyle=this.state.mainEventDetails && this.state.mainEventDetails.featureDetails&& this.state.mainEventDetails.featureDetails.featureRSVPOption;
      const weddingDates = {
        rsvpDateBy: rsvpByDate,
        featureRSVPOption: rsvpStyle
      }

      if(isMobile){
        if (weddingDates.featureRSVPOption == 'RSVP Registration'){
          $("#spanHeaderText").html("REGISTRATION");
        }
        else{
          $("#spanHeaderText").html("RSVP");
        }
      }

      var date_today=new Date();
      var formated_date = this.formatDate(date_today);//Calling formatDate Function

      var input_date = weddingDates.rsvpDateBy;
      var currentGuestData={};
      if (!navigator.onLine) {
          // console.log("offline");
          confirmBox();
      }
      if(guestInformation && guestId){
        guestInformation.map((data)=>{
            if(data._id==guestId){
              currentGuestData=data;
            }
        });
    }
      var currentDateTime = new Date(Date.parse(formated_date));
      var inputDateTime   = new Date(Date.parse(input_date));
      var rsvp_component;
      if (inputDateTime <= currentDateTime){
          rsvp_component = <RsvpDateExpired />
      }else if(weddingDates.featureRSVPOption == 'RSVP Wedding'){
          rsvp_component = <div className="container-fluid resposivemarginTopRSVP">
              <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block">RSVP</h3>
            <div className="row">
            <div className="myPassportBtnTop">
             <div className="BtnCommon responsiveBtn rsvpBtnMobile rsvpWeddingGuestName">
              {
                guestInformation && guestInformation.map((guest,i)=> {
                  return <button className={`btn commonBtnDestination appBodyFontColor  appBodyFontFamily ${guestId == guest._id && 'active'}`} onClick ={()=>{this.getSubEventsByGuest(guest)}} key={i}>{guest.guestFirstName}</button>
                })
              }
              </div>
             </div>
            </div>           
              <div className="BtnCommon responsiveHidden dateRow">
                {
                  eventDateArray.map((event,i)=> {
                    return <button className={`btn commonBtnDestination appBodyFontFamily appBodyFontColor ${(event === this.state.currentEventDate) ? "active" : ""}`}   key={i} onClick={()=>{this.getsubEvents(event)}}>{event.split(',')[0]}</button>
                  })
                }
              </div>
              <div className="BtnCommon resposiveVisile rsvpWedding">
              {
                eventDateArray && eventDateArray.map((event,i)=> {
                  return <button className={`btn commonBtnDestination appBodyFontFamily appBodyFontColor ${(event === this.state.currentEventDate) ? "active" : ""}`}  key={i} onClick={()=>{this.getsubEvents(event)}}>{event.split(',')[0]}</button>
                })
              }
              </div>
              {
                eventDetailArr && eventDetailArr.map((event,i)=> {
                  return <SubEvents event={event}  index={i} onClick={this.getEventArray}  rsvpDetails={rsvpDetails} guestId={this.state.guestId}/>
                  })
              }
              <div className="BtnCommon responsiveBtn rsvpWeddingGuestName">
                     <button className="btn commonBtnDestination appBodyFontFamily appBodyFontColor submitRsvp" onClick = {this.submitRsvpDetails}>SUBMIT</button>
                 </div>
          </div>
      }else if(weddingDates.featureRSVPOption == 'RSVP Conference'){
          rsvp_component =   <RsvpConferenceComponent updateData={this.updateData} currentGuestData={currentGuestData} guestId={this.state.guestId} guestInformation={guestInformation} eventDetails={eventDetails} eventDetailArr={eventDetailArr} rsvpDetails={rsvpDetails} eventDateArray={eventDateArray} getSubEventsByGuest={this.getSubEventsByGuest}/>
      }else{

        if(currentGuestData && currentGuestData.guestIsRegistered && currentGuestData.guestIsRegistered.length){
          rsvp_component = <div className="row third-rsvp registerd-margin">
          <div className="col-md-4"></div>
          <div className="col-md-4 appGradientColor appBodyFontFamily appBodyFontColor third-rsvp-content">
          <p>You are already registered!</p>
          </div>
          <div className="col-md-4"></div>
          </div>
        }else{
          rsvp_component = <RsvpRegistration registerRsvpCompanion={this.registerRsvpCompanion} registerRsvp = {this.guestRsvpRegister} guestinformation={guestInformation} currentGuestId={guestId} rsvpAskYes={this.rsvpAskYes} rsvpAskNo={this.rsvpAskNo} />
        }


        }
      return (
        <div>
          {rsvp_component}
        </div>
      );
    }
}
function mapStateToProps(state){
    return{
        eventId: getEventId(state),
        guestId: getGuestId(state),
        guestInformation: getGuestInformation(state),
        eventDetails: getEventDetails(state),
        rsvpDetails: getRsvpDetails(state),
        getLoggedInUserDetails: getLoggedInUserDetails(state)
    }
}
export default connect(mapStateToProps)(RSVP);
