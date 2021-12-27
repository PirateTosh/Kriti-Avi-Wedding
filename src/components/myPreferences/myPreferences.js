import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-web-meteor';
import $ from 'jquery';
import './myPreference.css';
import { isMobile, AppTItle, AppShortName } from '../../config/config.js';
import '../common.css';
import { connect } from "react-redux";
import { getEventDetails, getEventId, getGuestId, getEventByDate, getGuestInformation, getGuestFamily, getGuestPreference, getservicePreference, getEventSummary } from "../../selectors";
import { fetchPreferenceDetails, saveguestPreference, fetchAvailableServices, saveGuestServiceAppointments, fetchGuestInformation } from "../../api/guestInformationApi";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import { fetchAppDetails } from "../../api/appDetApi"
import { getAppDetails } from "../../selectors";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import _ from "lodash";
import { checkIsUserLoggedIn } from '../../api/storageAPI';
import { browserHistory } from "react-router";
import { Scrollbars } from 'react-custom-scrollbars';
import { fetchEventSummary } from "../../api/eventSummaryApi";
import moment from "moment";
import { confirmBox } from '../confirmContent/confirmFile';


class MyPreferences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slot: '(Please pick a slot)',
      defaultGuestId: "",
      guestInformation: "",
      defaultAppointmentDate: "",
      guestPreference: {},
      foodPreference: '',
      sizePreference: '',
      appointmentdetails: '',
      foodPreferencesRemark: '',
      specialAssistanceRemark: '',
      foodCounter: 0,
      sizeCounter: 0,
      specialAssistanceCounter: 0,
      appDetails: cloneDeep(props.appDetails),
      servicePreference: cloneDeep(props.servicePreference),
      eventSummary: cloneDeep(props.eventSummary),
    };
    this.serviceHash = {

    };
    this.sessionEventId = '';
    this.sessionGuestId = '';
    this.currentSLot = '';

    this.showSlots = this.showSlots.bind(this);
    if (!navigator.onLine) {
      confirmBox();
    }
    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
      browserHistory.push("/");
    }
    this.updateGuestPreference = this.updateGuestPreference.bind(this);
    this.submitServiceAppointment = this.submitServiceAppointment.bind(this);
    this.updateDefaultDate = this.updateDefaultDate.bind(this);
    this.getEventAsPerGuest = this.getEventAsPerGuest.bind(this);
  }

  updateGuestDetail(event) {
    const field = event.target.name;
    let guestInformation = cloneDeep(this.state.guestInformation);
    set(guestInformation, field, event.target.value);
    return this.setState({ guestInformation: guestInformation });
  }

  getGuestToRender(defaultGuestDetails) {
    if (this.state.guestInformation === "") {
      this.setState({ guestInformation: defaultGuestDetails[0] });
      return defaultGuestDetails[0];
    }
    else {
      let changeGuestFamily = this.props.guestInformation && this.props.guestInformation.filter(data => {
        let guest = this.state.guestInformation;
        if (data._id === guest._id) {
          return data;
        }
      });
      return changeGuestFamily[0];
    }
  }


  componentDidMount() {
    const that = this;
    this.sessionEventId = localStorage.getItem('eventId');
    this.sessionGuestId = localStorage.getItem('guestId');
    fetchGuestInformation(this.props.guestId || this.sessionGuestId, false);
    fetchWelcomeDetails();
    fetchAppDetails();
    // Meteor.call("fetch.app.settings", this.sessionEventId, function(error, result){
    // if(error) {
    //   console.log(error);      
    // } 
    // // fetchPreferenceDetails("KEmHDdbt3RA4u7aqk");
    // });
    fetchEventSummary(this.props.guestId || this.sessionGuestId, true);
    fetchPreferenceDetails(this.props && this.props.eventId || this.sessionEventId);
    fetchAvailableServices(this.props && this.props.eventId || this.sessionEventId);

    // $('ul.optionList').hide();
    // $('.servicesMypreference').click(function(){
    //     $(this).siblings('ul.optionList').fadeToggle(0);
    // });

    // $('ul.optionList li').click(function(){
    //     if(!$(this).hasClass('selected')){
    //         $(this).siblings('li').each(function(){
    //             $(this).removeClass('select');
    //         });
    //         $(this).addClass('select');
    //         $(this).parent('ul').siblings('.servicesMypreference').children('span.slot-time').html($(this).html());
    //         $(this).parent('ul.optionList').hide()
    //     }
    // // }); 
    // $(document).ready(function () {
    //     $('ul.optionList').hide();
    //     console.log('::::::::::::::::::::::::::::::::::::::::::::::::', that.currentSLot);
    //     $('.servicesMypreference').click(function(){
    //         $(this).siblings('ul.optionList').fadeToggle(0);
    //     });
    //     $('ul.optionList li').click(function(){
    //         if(!$(this).hasClass('selected')){
    //             $(this).siblings('li').each(function(){
    //                 $(this).removeClass('select');
    //             });
    //             $(this).addClass('select');
    //             $(this).parent('ul').siblings('.servicesMypreference').children('span.slot-time').html($(this).html());
    //             $(this).parent('ul.optionList').hide()
    //         }
    // }); 
    // })
    // $('html').scrollTop(0) ;
    if (isMobile) {
      $("#spanHeaderText").html("My Preferences");
      $(".notificationBell").show();
      $(".appLogo").hide()
      $(".chat").show();
    }
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.appDetails !== nextProps.appDetails) {
      let appDetails = cloneDeep(nextProps.appDetails);
      this.setState({ appDetails: appDetails });
    }
    if (this.props.eventSummary !== nextProps.eventSummary) {
      let eventSummary = cloneDeep(nextProps.eventSummary);
      this.setState({ eventSummary: eventSummary });
    }
  }
  getGuestFamilyDetails(event) {
    event.preventDefault();
    this.setState({
      foodPreference: '',
      sizePreference: '',
      foodPreferencesRemark: '',
      sizePreferenceRemark: '',
      specialAssistanceRemark: '',
      services: [],
      foodCounter: 0,
      specialAssistanceCounter: 0,
      sizeCounter: 0
    })
    let id = get(event.target, "attributes['id'].value");
    let data = this.props.guestInformation && this.props.guestInformation.filter(data => {
      if (data._id === id) {
        return data;
      }
    });
    return this.setState({ guestInformation: data[0] });
  }

  updateGuestPreference(event) {
    const servicesArray = [];
    if (event.target.name === 'foodPreference') {
      this.setState({
        foodPreference: event.target.value
      })
    }
    if (event.target.name === 'sizePreference') {
      this.setState({
        sizePreference: event.target.value
      })
    }
    if (event.target.name === 'foodPreferencesRemark') {
      const val = event.target.value;
      if(val && val !== '' && val !== null && val !== undefined) {
        this.setState((prevState) => {
          return {
            foodCounter: prevState.foodCounter + 1,
            foodPreferencesRemark: val
          }
        })
      }
    }
    if (event.target.name === 'specialAssistanceRemark') {
      const val = event.target.value;
      if(val && val !== '' && val !== null && val !== undefined) {
        this.setState((prevState) => {
          return {
            specialAssistanceCounter: prevState.specialAssistanceCounter + 1,
            specialAssistanceRemark: val
          }
        })
      }
    }
    if (event.target.name === 'sizePreferenceRemark') {
      const val = event.target.value;
      if(val && val !== '' && val !== null && val !== undefined) {
        this.setState((prevState) => {
          return {
            sizeCounter: prevState.sizeCounter + 1,
            sizePreferenceRemark: val
          }
        })
      }
    }

    if (event.target.name === 'specialAssistance') {
      const checkboxSelected = $('input[type="checkbox"]:checked');
      const that = this;
      if (checkboxSelected.length) {
        $(checkboxSelected).each(function () {
          servicesArray.push($(this).val());
        })
        that.setState({
          services: servicesArray
        });
      } else {
        that.setState({
          services: []
        });
      }
    }

    const field = event.target.name;
    let guestPreference = this.state.guestPreference;
    if (event.target.type === 'checkbox') {
      set(guestPreference, field, servicesArray);
    } else {
      set(guestPreference, field, event.target.value);
    }
    return this.setState({ guestPreference: guestPreference });
  }

  savePreferences(event) {
    event.preventDefault();
    let updatedGuestDetails = Object.assign({}, this.state.guestPreference);
    saveguestPreference(this.state.guestInformation._id, updatedGuestDetails);
  }
  saveMealPreferences(event) {
    event.preventDefault();
    let updatedGuestDetails = Object.assign({}, this.state.guestPreference);
    let data = {
      foodPreference: updatedGuestDetails.foodPreference,
      foodPreferencesRemark: updatedGuestDetails.foodPreferencesRemark
    };
    saveguestPreference(this.state.guestInformation._id, updatedGuestDetails, data);
  }
  saveSizePreferences(event) {
    event.preventDefault();
    let updatedGuestDetails = Object.assign({}, this.state.guestPreference);
    let data = {
      sizePreference: updatedGuestDetails.sizePreference,
      sizePreferenceRemark: updatedGuestDetails.sizePreferenceRemark
    };
    saveguestPreference(this.state.guestInformation._id, updatedGuestDetails, data);
  }
  saveAssistancePreferences(event) {
    event.preventDefault();
    let updatedGuestDetails = Object.assign({}, this.state.guestPreference);
    let data = {
      specialAssistance: updatedGuestDetails.specialAssistance,
      specialAssistanceRemark: updatedGuestDetails.specialAssistanceRemark
    };
    saveguestPreference(this.state.guestInformation._id, updatedGuestDetails, data);
  }
  componentDidUpdate() {
    const that = this;
    $(document).ready(function () {
      //$('ul.optionList').hide();
      $('ul.optionList li').click(function () {
        if (!$(this).hasClass('selected')) {
          $('.update-info').show();
          $(this).siblings('li').each(function () {
            $(this).removeClass('select');
          });
          $(this).addClass('select');
          $(this).closest('.col-sm-4').find('.slot-time').html($(this).html());
          $(this).closest('ul.optionList').hide();
        }
      });
    })
    $('html').scrollTop(0);
  }

  preferenceClick(e) {
    $(e.target).closest('.col-sm-4').find('ul.optionList').fadeToggle(0);
  }

  deletePreference(e) {
    $(e.target).closest('.col-sm-4').find('ul.optionList li').removeClass('select');
    $(e.target).closest('.col-sm-4').find('ul.optionList li[data-deleted="true"]').addClass('select');
    $(e.target).closest('.col-sm-4').find('.slot-time').html('(Pick a slot)');
    $('.update-info').show();
  }

  setserviceAppointmentsData() {
    const servicePrefData = cloneDeep(this.props.servicePreference);
    var dateArray = [];
    servicePrefData && servicePrefData.services && servicePrefData.services.map((service) => {
      service.providers && service.providers.map((provider) => {
        const utcStartDate = new Date(provider.serviceStartDate);
        const utcEndDate = new Date(provider.serviceEndDate);
        const newDateArray = this.getDates(utcStartDate, utcEndDate, provider.serviceId, dateArray);
        const serviceId = provider.serviceId;
        this.serviceHash[serviceId] = {
          serviceName: service.serviceName,
          serviceDesc: service.serviceDescription
        }
      });
    });
    let dateSortedArray = [].slice.call(dateArray).sort(function (d1, d2) {
      return (new Date(d1.date) < new Date(d2.date) ? -1 : 1)
    });
    return dateSortedArray;
  }

  getDates(startDate, stopDate, serviceId, dateArray) {
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      const date = new Date(currentDate);
      const momentDate = moment(date);
      const toDateStr = date.toDateString();
      let indexToAdd;
      for (let i = 0; i < dateArray.length; i++) {
        if (dateArray[i]['date'] == momentDate.format("D MMMM, YYYY")) {
          indexToAdd = i + 1;
        }
      }
      if (indexToAdd) {
        let serviceProviderArray = dateArray[indexToAdd - 1]["serviceProvider"];
        serviceProviderArray.push(serviceId);
        dateArray[indexToAdd - 1].serviceProvider = serviceProviderArray;
      } else {
        dateArray.push({ date: momentDate.format("D MMMM, YYYY"), serviceProvider: [serviceId] });
      }
      currentDate = this.addDays(currentDate, 1);
    }
    return dateArray;
  }

  getDefaultDate(data) {
    if (this.state.appointmentdetails === "") {
      this.setState({ appointmentdetails: data[0].date });
      return data[0];
    } else {
    }
  }

  updateDefaultDate(event) {
    const date = event.target.id;
    this.setState({
      appointmentdetails: date
    })
  }

  submitServiceAppointment() {
    const totalServices = $('ul.optionList .select');
    const data = [];
    const deletedata = [];
    var deleted = false;
    const guestId = this.state.guestInformation._id;
    $.each($('ul.optionList .select'), function (i, val) {
      const serviceId = $(this).attr('data-serviceid');
      const serviceTime = $(this).attr('data-servicetime');
      const serviceDate = $(this).attr('data-servicedate');
      const deletedType = $(this).attr('data-deleted');
      if (deletedType == "true") {
        deleted = true;
      }
      data.push({
        guestId,
        serviceId,
        serviceTime,
        serviceDate,
        deleted
      })
    })
    saveGuestServiceAppointments(data);
    $('.update-info').hide();
  }

  addDays(currentDate, days) {
    var date = currentDate;
    date.setDate(date.getDate() + days);
    return date;
  }

  getEventAsPerGuest(eventSummary) {
    if (this.state.guestInformation === "") {
      return null;
    }
    let returnEvents = null;
    eventSummary && eventSummary.map((event) => {
      let guest = this.state.guestInformation;
      if (event._id === (guest && guest._id)) {
        returnEvents = event;
      }
    });
    return returnEvents;
  }


  showSlots(serviceAppointmentData, defaultEvent, defaultGuest) {
    const servicePreference = this.props.servicePreference;
    let slotPerService = servicePreference && servicePreference.slots && _.uniqBy(servicePreference.slots, function (e) {
      return [e.serviceTime, e.serviceId, e.serviceDate].join()
    })
    return (
      <div className="row" style={{ marginTop: '20px' }}>
        {
          serviceAppointmentData && serviceAppointmentData.map((data) => {
            return (
              (data.date === this.state.appointmentdetails) && data.serviceProvider && data.serviceProvider.map((provider, key) => {
                if (defaultEvent) {
                  this.currentSLot = "";
                  defaultEvent && defaultEvent.serviceBookings && defaultEvent.serviceBookings.map((datanew) => {
                    if (datanew.serviceDate === data.date && provider === datanew.serviceId) {
                      this.currentSLot = datanew.serviceTime;
                      this.selectedServiceDate = datanew.serviceDate;
                    }
                  })
                }
                const slotString = this.currentSLot || '(Pick a slot)';
                return (
                  <div className="col-sm-4" key={key}>
                    <div className="servicesMypreference">
                      <div className="service-header">
                        <p className="service-name">{this.serviceHash[provider].serviceName}</p>
                      </div>
                      <div className="test">
                        {slotString && slotString != '(Pick a slot)' &&
                          <div className="service-slot">
                            <p className="slot-time">{slotString}</p>
                            <p className="service-actions">
                              <i className="fa fa-pencil" onClick={this.preferenceClick.bind(this)}></i>
                              <i className="fa fa-trash" style={{ marginLeft: '20px' }} onClick={this.deletePreference.bind(this)}></i>
                            </p>
                          </div>
                        }
                        {slotString && slotString == '(Pick a slot)' &&
                          <div className="empty-service-slot" onClick={this.preferenceClick.bind(this)}>
                            <p className="slot-time" >{slotString}</p>
                          </div>
                        }
                      </div>
                    </div>
                    <ul className="optionList" style={{ display: "none" }}>
                      {slotString && slotString != '(Pick a slot)' &&
                        <li style={{ 'display': 'none' }} data-value="" data-provider="" data-serviceid={provider} data-servicetime={this.currentSLot} data-servicedate={this.selectedServiceDate} data-deleted="true" key="">No Service Slot</li>
                      }
                      {
                        slotPerService.map((slot, i) => {
                          if (slot.serviceId === provider && data.date === (slot.serviceDate)) {
                            if (slot.serviceTime === slotString) {
                              return null
                            } else {
                              return (
                                <li data-value={slot.servicetime} data-provider={slot.providerId} data-serviceid={slot.serviceId} data-servicetime={slot.serviceTime} data-servicedate={slot.serviceDate} data-deleted="false" key={`${slot.serviceTime}${slot.providerId}${i}`}>{slot.serviceTime}</li>
                              )
                            }
                          }
                        })
                      }
                    </ul>
                  </div>
                )
              })
            )
          })
        }
      </div>
    )
  }

  getServiceApoointmentsSection(defaultEvent, defaultGuest) {
    const serviceAppointmentData = this.setserviceAppointmentsData();
    let defaultDate = serviceAppointmentData && serviceAppointmentData.length && this.getDefaultDate(serviceAppointmentData);
    if (typeof defaultDate == 'undefined') {
      defaultDate = [];
    }
    defaultDate = this.state.appointmentdetails;
    return (
      <div id="collapseFive" className="card-body myPreference-card-body appGradientColor appBodyFontFamily collapse" data-parent="#accordion" >
        <div className="row selectARoomRadio">
          <form>
            <div className="radio-group">
              {
                serviceAppointmentData && serviceAppointmentData.map((data, key) => {
                  return (
                    <div className={` btn serviceBtn  ${(defaultDate === data.date) ? "active" : ""}`} key={data.date}
                      id={data.date} onClick={this.updateDefaultDate.bind(this)}>{data.date.split(',')[0]}</div>
                  )
                })
              }
            </div>
          </form>
        </div>
        {this.showSlots(serviceAppointmentData, defaultEvent, defaultGuest)}
        <div className="update-info" style={{ display: "none" }}>Please click update button to save your changes.</div>
        <div className="updateBtn" style={{ marginTop: "15px" }}>
          <button onClick={this.submitServiceAppointment.bind(this)}>UPDATE</button>
        </div>
      </div>
    )
  }

  render() {
    $('.backIcon').show();
    $('.backIconMobile').show();
    const { list, guestFamily, guestInformation, nearestAirportList, guestPreference } = this.props;
    let defaultGuest = guestInformation && this.getGuestToRender(guestInformation);
    const { appDetails } = this.state;
    let appdet = this.state.appDetails;
    if (typeof defaultGuest == 'undefined') {
      defaultGuest = [];
    }
    if (this.refs.sizePreferenceRemark) {
      this.refs.sizePreferenceRemark.value = (this.state.sizeCounter === 0 ? defaultGuest.sizePreferenceRemark : this.state.sizePreferenceRemark) || '';
    }
    if (this.refs.foodPreferencesRemark) {
      this.refs.foodPreferencesRemark.value = (this.state.foodCounter === 0 ? defaultGuest.foodPreferencesRemark : this.state.foodPreferencesRemark) || '';
    }
    if (this.refs.specialAssistanceRemark) {
      this.refs.specialAssistanceRemark.value = (this.state.specialAssistanceCounter === 0 ? defaultGuest.specialAssistanceRemark : this.state.specialAssistanceRemark) || '';
    }
    const defaultEvent = this.getEventAsPerGuest(this.state.eventSummary);
    return (
      <div className="container">
        <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block ">MY PREFERENCE</h3>
        <div className="row mp-top">
          <div className="myPassportBtnTop">
            {guestFamily && guestFamily.map(guest => {
              return <button className={`btn btn-default btn-responsive ankur appBodyFontFamily appBodyFontColor ${(guest.guestId === defaultGuest._id) ? "active" : ""}`} key={guest.guestId} id={guest.guestId} onClick={this.getGuestFamilyDetails.bind(this)}>{guest.guestName}</button>
            })}
          </div>
        </div>
        <div className="row travelUpload"></div>
        {defaultGuest &&
          <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-8">
            {/* {console.log("Selected features - ", appdet.appDetails.selectedAppPreferences)} */}
              <div id="accordion" className="accordion">
                <div className="card myPreference-card mb-0 appBodyFontFamily appBodyFontColor">              
                  {appdet && appdet.appDetails && appdet.appDetails.selectedAppPreferences &&
                    appdet.appDetails.selectedAppPreferences.map(features => {
                      if (features === "Meal") {
                        return (                          
                          <div>
                            <div className="card-header card-header-customized appGradientColor collapsed" data-toggle="collapse" href="#collapseOne">
                              <a className="card-title"> <i className="icon-food-itineray-and-meal" aria-hidden="true"></i>
                                MEAL PREFERENCES<i className="fa" aria-hidden="true"></i>
                              </a>
                            </div>
                            <div id="collapseOne" className="card-body myPreference-card-body appBodyFontFamily appGradientColor collapse" data-parent="#accordion" >
                              <div className="row">
                                <div className="col-md-4">
                                  {/* */}

                                </div>
                                {/*<div className="col-md-8 radioresponsive float-left">
                                       <p className="appBodyFontColor topHint  topHint1 ">
                                        {guestPreference && guestPreference.foodPreference && guestPreference.foodPreference.foodSectionRemarks}
                                        </p>
                                        </div>*/}

                              </div>
                             <div className="row">
                                <div className="col-md-4 radioresponsive">
                                {guestPreference && guestPreference.foodPreference && guestPreference.foodPreference.foodSectionStatement !== undefined && guestPreference.foodPreference.foodSectionStatement !== '' && guestPreference.foodPreference.foodSectionStatement &&
                                  <p className="appBodyFontFamily appBodyFontColor remarkTitle">{guestPreference.foodPreference.foodSectionStatement}</p>
                                }
                                  <form className="float-right">
                                    <div className="radio-group mypreference-radio-group" >
                                      {guestPreference && guestPreference.foodPreference && guestPreference.foodPreference.foodPreferences &&
                                        guestPreference.foodPreference.foodPreferences.map((data) => {
                                          if (data) {
                                            return (
                                              <div key={data}>
                                                <input type="radio" id={data} name="selector" name="foodPreference" onChange={this.updateGuestPreference.bind(this)} checked={data === (this.state.foodPreference || defaultGuest.foodPreference)} value={data} />
                                                <label htmlFor={data}>{data}</label>
                                              </div>
                                            )
                                          }
                                        })}

                                    </div>
                                  </form>
                                </div>
                                <div className="col-md-8  myPreferenceTextArea">
                                  <textarea className="textarea" style={{fontSize: '14px' }} rows="3" cols="70" name="foodPreferencesRemark" ref="foodPreferencesRemark" placeholder={guestPreference && guestPreference.foodPreference && guestPreference.foodPreference.foodSectionRemarks}
                                    onChange={this.updateGuestPreference.bind(this)}>
                                  </textarea>
                                </div>

                              </div>
                              <div className="updateBtn appBodyFontFamily appBodyFontColor">
                                <button onClick={this.saveMealPreferences.bind(this)}>UPDATE</button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })
                  }
                  {appdet && appdet.appDetails && appdet.appDetails.selectedAppPreferences &&
                    appdet.appDetails.selectedAppPreferences.map(features => {
                      if (features === "Size") {
                        return (
                          <div>
                            <div className="card-header card-header-customized appGradientColor collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">
                              <a className="card-title"> <i className="icon-merchandise" aria-hidden="true"></i>
                                MERCHANDIZE SIZE<i className="fa" aria-hidden="true"></i>
                              </a>
                            </div>
                            <div id="collapseTwo" className="card-body myPreference-card-body appBodyFontFamily appGradientColor collapse" data-parent="#accordion" >
                            {guestPreference && guestPreference.sizePreference && guestPreference.sizePreference.sizeSectionStatement !== undefined && guestPreference.sizePreference.sizeSectionStatement !== '' && guestPreference.sizePreference.sizeSectionStatement &&
                                  <p className="appBodyFontFamily appBodyFontColor remarkTitle">{guestPreference.sizePreference.sizeSectionStatement}</p>
                            }                               
                              <div className="row">
                                <div className="col-md-4 radioresponsive">
                                  {/*{guestPreference && guestPreference.sizePreference && guestPreference.sizePreference.sizeSectionStatement} */}
                                  <form className="float-right">
                                    <div name="sizePreference" className="radio-group mypreference-radio-group">
                                      {guestPreference && guestPreference.sizePreference && guestPreference.sizePreference.sizePreferences &&
                                        guestPreference.sizePreference.sizePreferences.map((data) => {
                                          if (data) {
                                            return (
                                              <div key={data}>
                                                <input type="radio" id={data} name="sizePreference" value={data} onChange={this.updateGuestPreference.bind(this)} checked={data === (this.state.sizePreference || defaultGuest.sizePreference)} />
                                                <label htmlFor={data}>{data}</label>
                                              </div>
                                            )
                                          }
                                        }
                                        )
                                      }
                                    </div>
                                  </form>
                                </div>
                                <div className="col-md-8  myPreferenceTextArea">
                                  <textarea className="textarea" style={{ fontSize: '14px' }} rows="3" cols="70" name="sizePreferenceRemark" ref="sizePreferenceRemark" placeholder={guestPreference && guestPreference.sizePreference && guestPreference.sizePreference.sizeSectionRemarks}

                                    onChange={this.updateGuestPreference.bind(this)}>
                                  </textarea>
                                </div>
                              </div>
                              <div className="updateBtn">
                                <button onClick={this.saveSizePreferences.bind(this)}>UPDATE</button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })
                  }
                  {appdet && appdet.appDetails && appdet.appDetails.selectedAppPreferences &&
                    appdet.appDetails.selectedAppPreferences.map(features => {
                      if (features === "Special Assistance") {
                        return (
                          <div>
                            <div className="card-header card-header-customized appGradientColor collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree">
                              <a className="card-title"> <i className="icon-special-assistance" aria-hidden="true"></i>
                                SPECIAL ASSISTANCE<i className="fa" aria-hidden="true"></i>
                              </a>
                            </div>
                            <div id="collapseThree" className="card-body myPreference-card-body appBodyFontFamily appGradientColor collapse" data-parent="#accordion" >
                            {guestPreference && guestPreference.specialPreference && guestPreference.specialPreference.assistanceSectionStatement !== undefined && guestPreference.specialPreference.assistanceSectionStatement !== '' && guestPreference.specialPreference.assistanceSectionStatement &&
                                  <p className="appBodyFontFamily appBodyFontColor remarkTitle">{guestPreference.specialPreference.assistanceSectionStatement}</p>
                                }
                              <div>
                               <div className="row special-Radio">
                                  <form>
                                    <div className="radio-group" className="specialAssistances specialAssistancesDisplay appBodyFontColor mypreference-radio-group">
                                      {guestPreference && guestPreference.specialPreference && guestPreference.specialPreference.assistanceOptions &&
                                        guestPreference.specialPreference.assistanceOptions.map((data) => {
                                          const arrayOfAssistance = this.state.services && this.state.services.length ? this.state.services : defaultGuest.specialAssistance;
                                          const isChecked = arrayOfAssistance && arrayOfAssistance.indexOf(data) !== -1 ? true : false;
                                          
                                          if (data) {
                                            return (
                                              <div key={data}>
                                                <input type="checkbox" id={data} name="specialAssistance"  value={data} checked={isChecked} onChange={this.updateGuestPreference.bind(this)} />
                                                <label htmlFor={data}>{data}</label>
                                              </div>
                                            )
                                          }
                                        })}
                                    </div>
                                  </form>
                                </div>
                              </div>
                              <div className="myPreferenceTextArea myPreferenceTextArea1">
                              </div><div className="myPreferenceTextArea myPreferenceTextArea1">
                                <textarea className="textarea" style={{  fontSize: '14px' }} rows="3" cols="70" name="specialAssistanceRemark" ref="specialAssistanceRemark"
                                  placeholder={guestPreference && guestPreference.specialPreference && guestPreference.specialPreference.assistanceRemarks} onChange={this.updateGuestPreference.bind(this)}>
                                </textarea>
                              </div>
                              <div className="updateBtn">
                                <button onClick={this.saveAssistancePreferences.bind(this)}>UPDATE</button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })
                  }
                  {/* <div className="card-header card-header-customized appGradientColor collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFour">
                                    <a className="card-title"> <i className="fa fa-wheelchair" aria-hidden="true"></i>
                                        ROOM REQUIREMENT<i className="fa fa-check" aria-hidden="true"></i>
                                    </a>
                                </div>
                                <div id="collapseFour" className="card-body myPreference-card-body appGradientColor collapse" data-parent="#accordion" >
                                    <div className="roomSection">
                                        <div className="myPreferenceSelection myPreferenceSelection-mobile">
                                            <select className="form-control form-controls-myPreference" id="exampleSelect1">
                                                <option>NUMBER OF ADULTS</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </select>
                                            <select className="form-control form-controls-myPreference" id="exampleSelect1">
                                                <option>NUMBER OF KIDS</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="roomSection">
                                        <p>Select a Room Type</p>
                                    </div>
                                    <div className="row special-Radio special-Radio-mobile">
                                        <form>
                                            <div className="radio-group">
                                                <input type="radio" id="SINGLE OCCUPANCY" name="selector" />
                                                <label htmlFor="SINGLE OCCUPANCY">SINGLE OCCUPANCY</label>
                                                <input type="radio" id="DOUBLE OCCUPANCY" name="selector" />
                                                <label htmlFor="DOUBLE OCCUPANCY">DOUBLE OCCUPANCY</label>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="roomSection">
                                        <p>Number of Rooms (max 2 guests per room)</p>
                                    </div>
                                    <div className="roomSection">
                                        <div className="myPreferenceSelection">
                                            <select className="form-control form-controls-myPreference" id="exampleSelect1">
                                                <option>NUMBER OF ROOMS</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="roomSection">
                                        <p>Additional Options</p>
                                    </div>
                                    <div className="row special-Radio special-Radio-Additional Options">
                                        <form>
                                            <div className="radio-group">
                                                <input type="radio" id="SMOKING" name="selector" />
                                                <label htmlFor="SMOKING">SMOKING</label>
                                                <input type="radio" id="NON-SMOKING" name="selector" />
                                                <label htmlFor="NON-SMOKING">NON-SMOKING</label>

                                            </div>
                                        </form>
                                    </div>
                                    <div style={{ marginTop: '15px' }} className="row  special-Radio special-Radio-Additional Options">
                                        <form>
                                            <div className="radio-group">
                                                <input type="radio" id="ADJACENT ROOMS" name="selector" />
                                                <label htmlFor="ADJACENT ROOMS">ADJACENT ROOMS</label>
                                                <input type="radio" id="ADJOINING ROOMS" name="selector" />
                                                <label htmlFor="ADJOINING ROOMS">ADJOINING ROOMS</label>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="updateBtn" style={{ marginTop: "15px" }}>
                                        <button>UPDATE</button>
                                    </div>
                                </div> */}
                  {appdet && appdet.featureDetails && appdet.featureDetails.selectedFeatures &&
                    appdet.featureDetails.selectedFeatures.map(features => {
                      if (features === "Services") {
                        return (
                          <div>
                            <div className="card-header card-header-customized appGradientColor collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseFive">
                              <a className="card-title"> <i className="icon-service-appointments" aria-hidden="true"></i>
                                SERVICE APPOINTMENTS<i className="fa" aria-hidden="true"></i>
                              </a>
                            </div>
                            {this.getServiceApoointmentsSection(defaultEvent, defaultGuest)}
                          </div>
                        );
                      }
                    })
                  }
                </div>
              </div>
            </div>
            <div className="col-md-2"></div>
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    eventDetails: getEventDetails(state),
    eventId: getEventId(state),
    guestId: getGuestId(state),
    eventByDate: getEventByDate(state),
    guestInformation: getGuestInformation(state),
    guestFamily: getGuestFamily(state),
    guestPreference: getGuestPreference(state),
    servicePreference: getservicePreference(state),
    eventSummary: getEventSummary(state),
    appDetails: getAppDetails(state)
  }
}

export default connect(mapStateToProps)(MyPreferences);
