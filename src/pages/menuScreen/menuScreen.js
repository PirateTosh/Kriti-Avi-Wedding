import React from "react";
import './menuScreen.css';
import {getEventName, getGuestId, getEventId, getWelcomeDetails} from "../../selectors";
import {fetchWelcomeDetails} from "../../api/welcomeApi";
import {connect} from "react-redux";
import {fetchGuestInformation} from "../../api/guestInformationApi";
import {fetchEventDetails} from "../../api/eventDetailsApi";
import {checkIsUserLoggedIn} from '../../api/storageAPI';
import {browserHistory} from "react-router";
import {fetchAppDetails}from "../../api/appDetApi"
import {getAppDetails} from "../../selectors";
import '../../config/config.js';
import $ from 'jquery';
import * as utility from '../../utility';
import {isMobile, eventTitle, AppTItle, AppShortName} from  '../../config/config.js';
import cloneDeep from "lodash/cloneDeep";

import MenuItem from "./menuItem";

class MenuScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      welcomeData : cloneDeep(props.welcomeData),
      appDetails :  cloneDeep(props.appDetails),
    };
    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
      browserHistory.push("/");
    };          
    this.sessionGuestId = localStorage.getItem('guestId');
    this.eventName = localStorage.getItem('eventName');
  }

  componentDidMount() { 
    // utility.setComponentHeight();
    if(isMobile){
      $("#spanHeaderText").html(AppShortName);
      $(".notificationBell").show();
      $(".chat").show();
      $(".appLogo").show();
    }
    fetchAppDetails(); 
    if(!this.props.welcomeData){
      fetchWelcomeDetails();
    }
  }
    
  componentWillReceiveProps(nextProps) {      
    if (this.props.appDetails !== nextProps.appDetails) {
      let appDetails = cloneDeep(nextProps.appDetails);
      this.setState({ appDetails: appDetails});
    }
    if (!nextProps.welcomeData) {
      fetchWelcomeDetails();
    }
    if (this.props.welcomeData !== nextProps.welcomeData) {
      this.setState({welcomeData: cloneDeep(nextProps.welcomeData)});
    }
  }
  
  openEventDetails(event){
    event.preventDefault();
    if(this.props.guestId || this.sessionGuestId){
      fetchEventDetails(this.props.guestId || this.sessionGuestId);
    }
  }
  
  openGuestInformation(event){
    event.preventDefault();
    if(this.props.guestId || this.sessionGuestId){
      fetchGuestInformation(this.props.guestId || this.sessionGuestId);
    }
  }
  render(){
    $('body').css('background-image','');
    $('body').attr('class','appBody');
    $('.backIcon').hide();
    $('.backIconMobile').hide();
    const {appDetails} = this.state;
    let appdet = this.state.appDetails;
    let welcomeData = this.state.welcomeData;
    let feedback = false;
    if(welcomeData && welcomeData.showFeedback && welcomeData.showFeedback === true)
    {
      feedback = true;
    }
    var rsvp_name='RSVP';
    if(appDetails && appDetails.featureDetails && appDetails.featureDetails.featureRSVPOption && appDetails.featureDetails.featureRSVPOption=="RSVP Registration" ){
      rsvp_name="REGISTRATION"
    }

    return(
      <div className="main-screen">
        <div className="appBodyFontColor appNavbarFontFamily event-name">
          {eventTitle}
        </div>
        <div className="menu-container">
          {appdet && appdet.basicDetails && appdet.basicDetails.eventType === "wedding" &&
            <MenuItem name="welcome" icon="icon-namaste" link="welcome"/>
          }
          {appdet && appdet.basicDetails && appdet.basicDetails.eventType !== "wedding" &&
            <MenuItem name="welcome" icon="icon-handshake" link="welcome"/>
          }
          {appdet && appdet.basicDetails && appdet.basicDetails.eventType === "wedding" &&
            <MenuItem name="about" icon="icon-bride-and-groom" link="brideAndGroom"/>
          }
          {appdet && appdet.basicDetails && appdet.basicDetails.eventType !== "wedding" &&
            <MenuItem name="about" icon="icon-manager" link="about"/>
          }
          {appdet && appdet.appDetails && appdet.appDetails.selectedAppDetails && appdet.appDetails.selectedAppDetails.map(list =>
            {
              if(list === "Destination") {
                return(
                  <MenuItem name="destination" icon="icon-destination" link="destination"/>
                );
              }
            })
          }          
          <MenuItem name="event details" icon="icon-event-details" link="eventDetails"/>
          {appDetails && appDetails.featureDetails && appDetails.featureDetails.featureRSVPOption && appDetails.featureDetails.featureRSVPOption !== "RSVP Registration" &&
            <MenuItem name="rsvp" icon="icon-rsvp-and-registration" link="rsvp"/>
          }
          {appDetails && appDetails.featureDetails && appDetails.featureDetails.featureRSVPOption && appDetails.featureDetails.featureRSVPOption === "RSVP Registration" &&
            <MenuItem name="registration" icon="icon-rsvp-and-registration" link="rsvp"/>
          }
          <MenuItem name="itinerary" icon="icon-itinerary" link="itinerary"/>
          <MenuItem name="my information" icon="icon-my-info" link="myInformation"/>
          {appdet && appdet.appDetails && appdet.appDetails.selectedAppDetails && appdet.appDetails.selectedAppDetails.map(list =>
            {
              if(list === "Travel Details"){
                  return(
                    <MenuItem name="travel details" icon="icon-travel-details" link="travelDetails"/>
                  );
                }
            })
          }
          <MenuItem name="my preferences" icon="icon-my-preferences" link="myPreferences"/>
          <MenuItem name="my summary" icon="icon-my-summary" link="mySummary"/>
          {(feedback)?             
            <MenuItem name="feedback" icon="icon-wishes" link="feedback"/> :
            <MenuItem name="wishes" icon="icon-wishes" link="wishes"/>
          }
          <MenuItem name="contact" icon="icon-contact-us" link="contactus"/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    eventName: getEventName(state),
    eventId: getEventId(state),
    guestId: getGuestId(state),
    appDetails: getAppDetails(state),
    welcomeData: getWelcomeDetails(state),
  }
}

export default connect(mapStateToProps)(MenuScreen);