import React, { Component } from 'react';
import { getEventSummary, getEventId, getGuestId, getGuestSummaryFamily } from "../../selectors";
import cloneDeep from "lodash/cloneDeep";
import './mySummary.css';
import { isMobile } from '../../config/config.js';
import '../common.css';
import $ from 'jquery';
import { connect } from "react-redux";
import { fetchEventSummary } from "../../api/eventSummaryApi";
import { checkIsUserLoggedIn } from '../../api/storageAPI';
import { browserHistory } from "react-router";
import moment from "moment";
import get from "lodash/get";
import set from "lodash/set";
import _ from 'lodash';

class MySummary extends Component {
  constructor(props) {
    super(props);
    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
      browserHistory.push("/");
    }
    this.state = {
      defaultGuestId: "",
      eventSummary: cloneDeep(props.eventSummary),
      guestInformation: ""
    };
    this.sessionEventId = '';
    this.sessionGuestId = '';
  }
  componentDidMount() {
    this.sessionEventId = localStorage.getItem('eventId');
    this.sessionGuestId = localStorage.getItem('guestId');
    fetchEventSummary(this.props.guestId || this.sessionGuestId, false);
    if (isMobile) {
      $("#spanHeaderText").html("My Summary");
      $(".notificationBell").show();
      $(".appLogo").hide()
      $(".chat").show();
    }
    $('html').scrollTop(0);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.eventSummary) {
      //fetchEventSummary(this.props.guestId  || this.sessionGuestId);
    }
    if (this.props.eventSummary !== nextProps.eventSummary) {
      let eventSummary = cloneDeep(nextProps.eventSummary);
      eventSummary && eventSummary.filter((gt) => {
        if (gt._id === (this.props.eventSummary && this.props.eventSummary._id)) {
          return gt;
        }
      });
      this.setState({ eventSummary: eventSummary[0] });
    }
  }

  updateGuestDetail(event) {
    const field = event.target.name;
    let guestInformation = this.state.guestInformation;
    set(guestInformation, field, event.target.value);
    return this.setState({ guestInformation: guestInformation });
  }

  getGuestSummaryToRender(defaultGuestDetails) {
    if (this.state.guestInformation === "") {
      this.setState({ guestInformation: defaultGuestDetails[0] });
      return defaultGuestDetails[0];
    }
    else {
      let changeGuestFamily = this.props.eventSummary && this.props.eventSummary.filter(data => {
        let guest = this.state.guestInformation;
        if (data._id === (guest && guest._id)) {
          return data;
        }
      });

      return changeGuestFamily[0];
    }
  }

  getGuestFamilyDetails(event) {
    event.preventDefault();
    let id = get(event.target, "attributes['id'].value");
    let data = this.props.eventSummary && this.props.eventSummary.filter(data => {
      if (data._id === id) {
        return data;
      }
    });

    return this.setState({ guestInformation: data[0] });
  }
  calculateTimeDiff(fromDate, toDate) {
    var date1 = moment(fromDate),
      date2 = moment(toDate);
    var duration = moment(moment(date1, "YYYY-MM-DD HH:mmA").diff(moment(date2, "YYYY-MM-DD HH:mmA"))).format("hh:mm");
    return duration;
  }

  render() {
    $('.backIcon').show();
    $('.backIconMobile').show();
    const { guestSummaryFamily, eventSummary } = this.props;
    let defaultSummary = eventSummary && this.getGuestSummaryToRender(eventSummary);
    
    let flights = defaultSummary && defaultSummary.flights;
    let sortedFlightList = _.sortBy(flights, 'flightLegs.0.flightDepartureTime')
    if (typeof defaultSummary == 'undefined') {
      defaultSummary = [];
    }

    return (
      <div className="container">
        <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block">MY SUMMARY</h3>
        <div className="row mT90 b20">
          <div className="myPassportBtnTop">
            {guestSummaryFamily && guestSummaryFamily.map(guest => {
              return <button className={`btn btn-default btn-responsive ankur appBodyFontFamily appBodyFontColor commonBtnDestination 
							appBodyFontFamily appBodyFontColor ${(guest.guestId === defaultSummary._id) ? "active" : ""}`} key={guest.guestId} id={guest.guestId} onClick={this.getGuestFamilyDetails.bind(this)}>{guest.guestName}</button>
            })}
          </div>
        </div>
        <div className="row summaryDiv">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <div id="accordion" className="accordion">
              <div className="card myPreference-card mb-0" style={{ color: 'transparent' }}>
                {defaultSummary && defaultSummary.flights && defaultSummary.flights.length > 0 &&
                  <div>
                    <div className="card-header card-header-customized appGradientColor appBodyFontFamily collapsed" data-toggle="collapse" href="#collapseOne">
                      <a className="card-title"> <i className="icon-flight-details" aria-hidden="true"></i>
                        FLIGHT DETAILS
                  		</a>
                    </div>
                    <div id="collapseOne" className="card-body myPreference-card-body appGradientColor appBodyFontFamily collapse appBodyFontColor" data-parent="#accordion" >
                      <div className="row ">
                        {defaultSummary && defaultSummary.flights &&
                          sortedFlightList.map((flightBooking, key) => {
                            var legCount = flightBooking.flightLegs && flightBooking.flightLegs.length;
                            return (
                              <div className="col-sm-6 mySummary " style={{ marginTop: "10px", borderBottom: "solid 1px #ccc", paddingBottom: "30px" }}>
                                <div className="row1p">
                                  {flightBooking.flightBookingReferenceNo && <p>Booking Ref No.: {flightBooking.flightBookingReferenceNo} </p>}
                                  {flightBooking.flightBookCost && <p>Cost per Ticket: {flightBooking.flightBookCost}/</p>}
                                </div>
                                <div className="itinerary1">
                                  {defaultSummary && defaultSummary.flights && flightBooking.flightLegs &&
                                    flightBooking.flightLegs.map((flightBookingLegs, keyLeg) => {
                                      return (
                                        <div style={{ paddingBottom: '20px' }}>
                                          <i className="fa fa-plane fa-plane-Down" aria-hidden="true"></i>
                                          <span className="spanTopContent">
                                            {defaultSummary && defaultSummary.airports &&
                                              defaultSummary.airports.map((airports, key) => {
                                                if (airports._id === flightBookingLegs.flightDepartureCityId) {
                                                  return (<span>{airports.airportIATA} - {airports.airportLocation}, {airports.airportCountry}</span>);
                                                }
                                              })
                                            }
                                          </span><br />
                                          {flightBookingLegs.flightDepartureTime && <span className="spanDownContent">{moment(flightBookingLegs.flightDepartureTime).format("DD-MM-YYYY HH:mm")}</span>}
                                          <div className="borderSummary"></div>
                                          <div className="itineraryMiddle">
                                            {flightBookingLegs.flightDurationHours && flightBookingLegs.flightDurationMins && <p style={{ paddingLeft: '10px' }}>{flightBookingLegs.flightDurationHours} : {flightBookingLegs.flightDurationMins}</p>}
                                            {defaultSummary && defaultSummary.airlines &&
                                              defaultSummary.airlines.map((airlinesDet, key) => {
                                                if (airlinesDet._id === flightBookingLegs.flightId) {
                                                  return (<p>{airlinesDet.airlineName} {flightBookingLegs.flightNo}</p>);
                                                }
                                              })
                                            }
                                            {flightBooking.pnrNumber && <p>PNR: {flightBooking.pnrNumber}</p>}
                                          </div>
                                          <div className="borderSummary"></div>
                                          <i className="fa fa-plane fa-plane-Down" aria-hidden="true"></i>
                                          <span className="spanTopContent">
                                            {defaultSummary && defaultSummary.airports &&
                                              defaultSummary.airports.map((airports, key) => {
                                                if (airports._id === flightBookingLegs.flightArrivalCityId) {
                                                  return (<span>{airports.airportIATA} - {airports.airportLocation}, {airports.airportCountry}</span>);
                                                }
                                              })
                                            }
                                          </span><br />
                                          {flightBookingLegs.flightArrivalTime && <span className="spanDownContent">{moment(flightBookingLegs.flightArrivalTime).format("DD-MM-YYYY HH:mm")}</span>}
                                      </div>
                                      );
                                    })
                                  }
                                </div>
                              </div>
                            );
                          })
                        }                 
                      </div>
                    </div>
                  </div>
                }
      {defaultSummary && defaultSummary.hotelBookings && defaultSummary.hotelBookings.length > 0 &&
                  <div>
                    <div className="card-header card-header-customized appGradientColor appBodyFontFamily collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">
                      <a className="card-title"> <i className="icon-bed" aria-hidden="true"></i>
                        HOTEL BOOKING
                      </a>
                    </div>
                    <div id="collapseTwo" className="card-body myPreference-card-body appGradientColor appBodyFontFamily collapse appBodyFontColor" data-parent="#accordion" >
                      {defaultSummary && defaultSummary.hotelBookings && defaultSummary.hotels &&
                        defaultSummary.hotelBookings.map((hotelBooking, key) => {
                        return (                          
                            <div className="row hotel-block">
                              <div className="col-md-6 col-xs-12 HOTEL-BOOKING">                      
                                {
                                  
                                }
                                {defaultSummary.hotels.map((hotel, key) => {                                    
                                    if(hotel._id === hotelBooking.hotelId) {
                                      let {roomSharerName} = defaultSummary;
                                      let roomGuestName =[];
                                      let isRoomSharer = defaultSummary && defaultSummary.roomSharer && defaultSummary.roomSharerName && defaultSummary.roomSharerName.length >1;
                                      
                                      return (
                                        <div>
                                          <div
                                            ckey={hotel._id}
                                            className="hotel-font-weight-bold "
                                          >
                                            Hotel: {hotel.hotelName}
                                          </div>
                                          <div>
                                            <p>
                                              Check-In Date:{" "}
                                              {moment(
                                                hotelBooking.hotelRoomFrom
                                              ).format("DD-MM-YYYY")}
                                            </p>
                                            <p>
                                              Check-Out Date:{" "}
                                              {moment(
                                                hotelBooking.hotelRoomTo
                                              ).format("DD-MM-YYYY")}
                                            </p>
                                            <p>
                                              {hotelBooking.roomNumber
                                                ? `Room Number: ${hotelBooking.roomNumber}`
                                                : ""}
                                            </p>
                                            {isRoomSharer ? (
                                              <React.Fragment>
                                                <p>Room Shared With:</p>
                                                {defaultSummary.roomSharer.map(
                                                  roommate => {
                                                    if (
                                                      roommate.guestId !== defaultSummary._id &&
                                                      roommate.hotelId === hotelBooking.hotelId &&
                                                      roommate.roomId ===  hotelBooking.roomId
                                                    ) {
                                                      return (
                                                        <React.Fragment>
                                                          {roomSharerName
                                                            .filter(
                                                              g =>
                                                                g._id !== defaultSummary._id &&
                                                                g._id === roommate.guestId
                                                            )
                                                            .map(guest => (
                                                              <p>
                                                               {guest.guestFirstName} {guest.guestLastName}
                                                              </p>
                                                            ))}
                                                        </React.Fragment>
                                                      );
                                                    }
                                                  }
                                                )}
                                              </React.Fragment>
                                            ) : null}
                                          </div>
                                        </div>
                                      );
                                    }
                                 })
                                }
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                }
                {defaultSummary && defaultSummary.preferences && ((Object.values(defaultSummary.preferences.specialAssistance).length) > 0 || (Object.values(defaultSummary.preferences.food).length) > 0) &&
                  <div>

                    <div className="card-header card-header-customized appGradientColor appBodyFontFamily collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapsePreferences">
                      <a className="card-title"> <i className="icon-my-preferences" aria-hidden="true"></i>
                        MY PREFERENCES
                      </a>
                    </div>
                    <div id="collapsePreferences" style={{ fontSize: '14px' }} className="card-body myPreference-card-body appGradientColor appBodyFontFamily collapse appBodyFontColor" data-parent="#accordion" >
                      <div className="row">
                        {defaultSummary && defaultSummary.preferences && defaultSummary.preferences.food && defaultSummary.preferences.food.preference && defaultSummary.preferences.food.preference.length > 0 &&
                          <div className="col-sm-12 text-center appBodyFontColor">
                            <strong> <u>Food Preferences</u> </strong>
                            <p>{defaultSummary.preferences.food.preference}
                              {defaultSummary && defaultSummary.preferences && defaultSummary.preferences.food && defaultSummary.preferences.food.remark !== undefined && defaultSummary.preferences.food.remark !== "" &&
                                <span style={{ display: 'block' }}>Remark: {defaultSummary.preferences.food.remark}</span>
                              }</p>
                          </div>
                        }
                        {defaultSummary && defaultSummary.preferences && defaultSummary.preferences.size &&  defaultSummary.preferences.size.preference && defaultSummary.preferences.size.preference !=="" &&
                          <div className="col-sm-12 text-center appBodyFontColor">
                            <strong> <u> {(defaultSummary && defaultSummary.preferences.size && defaultSummary.preferences.size.name) ?
                              defaultSummary.preferences.size.name : "Merchandise"
                            }</u></strong>
                            <p>Size : {defaultSummary.preferences.size.preference}
                            {defaultSummary && defaultSummary.preferences && defaultSummary.preferences.size && defaultSummary.preferences.size.remark !== undefined && defaultSummary.preferences.size.remark !== "" &&
                              <span style={{ display: 'block' }}>Remark: {defaultSummary.preferences.size.remark}</span>
                            }
                            </p>
                          </div>
                        }
                        {defaultSummary && defaultSummary.preferences && defaultSummary.preferences.specialAssistance && defaultSummary.preferences.specialAssistance.preference && defaultSummary.preferences.specialAssistance.preference.length > 0 &&
                          <div className="col-sm-12 text-center appBodyFontColor">
                            <strong> <u> Special Assistances</u></strong>
                            {defaultSummary.preferences.specialAssistance.preference && defaultSummary.preferences.specialAssistance.preference.map(a => {
                              return (
                                <span style={{ display: 'block' }}>{a}</span>
                              )

                            })
                            }
                            {defaultSummary && defaultSummary.preferences && defaultSummary.preferences.specialAssistance && defaultSummary.preferences.specialAssistance.remark !== undefined && defaultSummary.preferences.specialAssistance.remark !== "" &&
                              <span style={{ display: 'block' }}>Remark: {defaultSummary.preferences.specialAssistance.remark}</span>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                }

                {defaultSummary && ((defaultSummary.hospitalityManagers && defaultSummary.hospitalityManagers.length > 0) || (defaultSummary.transportManagers && defaultSummary.transportManagers.length > 0)) &&
                  <div>
                    <div className="card-header card-header-customized appGradientColor collapsed appBodyFontFamily" data-toggle="collapse" data-parent="#accordion" href="#collapseThree">
                      <a className="card-title"> <i className="icon-manager-info" aria-hidden="true"></i>
                        MANAGER’S INFORMATION
                      </a>
                    </div>
                    <div id="collapseThree" className="card-body myPreference-card-body appGradientColor appBodyFontFamily collapse appBodyFontColor" data-parent="#accordion" >
                      {
                        defaultSummary && defaultSummary.hospitalityManagers && defaultSummary.hospitalityManagers.length > 0 &&
                        defaultSummary.hospitalityManagers.map((manager, key) => {
                          return (
                            <div>
                              <div className="row">
                                <div className="col-md-12 col-sm-12" style={{ float: "center" }}>
                                  <p style={{ textAlign: "center", fontSize: '16px' }}>{(key === 0) ? 'Hospitality Manager(s)' : ''}</p>

                                </div>
                              </div>
                              <div className="row ">
                                <div className="col-md-4 col-sm-12 HOTEL-BOOKING">
                                  <p>{manager.hospitalityManagerName}</p>
                                </div>
                                <div className="col-md-4 col-sm-12 text-right HOTEL-BOOKING ">
                                  <a href={'tel:' + manager.hospitalityManagerNo} className="appBodyFontColor tel appBodyFontFamily"> <p> {manager.hospitalityManagerNo}</p></a>
                                </div>
                                <div className="col-md-4 col-sm-12 HOTEL-BOOKING">
                                  <p>Location : {manager.hospitalityManagerLocation}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      }
                      {
                        defaultSummary && defaultSummary.transportManagers && defaultSummary.transportManagers.length > 0 &&
                        defaultSummary.transportManagers.map((manager, key) => {
                          return (
                            <div>
                              <div className="row">
                                <div className="col-md-12 col-sm-12" style={{ paddingTop: '10px', textAlign: "center", fontSize: '16px' }}>
                                  <p style={{ textAlign: "center" }}>{(key === 0) ? 'Transport Manager(s)' : ''}</p>

                                </div>
                              </div>
                              <div className="row ">
                                <div className="col-md-4 col-sm-12 HOTEL-BOOKING">
                                  <p> {manager.airportManagerName} </p>

                                </div>
                                <div className="col-md-4 col-sm-12 text-right HOTEL-BOOKING ">
                                  <a href={'tel:' + manager.airportManagerNo} className="appBodyFontColor tel appBodyFontFamily"> <p> {manager.airportManagerNo}</p></a>
                                </div>
                                <div className="col-md-4 col-sm-12 HOTEL-BOOKING">
                                  <p>Location : {manager.airportManagerLocation}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                }
                {defaultSummary && defaultSummary.transportBookings && defaultSummary.transportBookings.length > 0 &&
                  <div>
                    <div className="card-header card-header-customized appGradientColor collapsed appBodyFontFamily" data-toggle="collapse" data-parent="#accordion" href="#collapseTransport">
                      <a className="card-title"> <i className="icon-transport" aria-hidden="true"></i>
                        TRANSPORT DETAILS
                  		</a>
                    </div>
                    <div id="collapseTransport" className="card-body myPreference-card-body appGradientColor appBodyFontFamily collapse appBodyFontColor" data-parent="#accordion" >
                      {
                        defaultSummary && defaultSummary.transportBookings && defaultSummary.transportBookings &&
                        defaultSummary.transportBookings.map((transportBooking, keyt1) => {
                          return (
                            <div>
                              <div className="row">
                                <div className="col-md-6 col-xs-12 HOTEL-BOOKING">
                                  {
                                    defaultSummary.drivers.map((driver, key) => {
                                      if (driver._id === transportBooking.driverId) {
                                        return (
                                          <div>
                                            <p lassName="HOTEL-BOOKING1 HOTEL-BOOKING-Mobile">Driver Name: {driver.driverName}
                                            </p>
                                            <p lassName="HOTEL-BOOKING1 HOTEL-BOOKING-Mobile">Contact Number: {driver.driverContact}
                                            </p>
                                          </div>
                                        );
                                      }
                                    })
                                  }
                                </div>
                                <div className="col-md-6 col-xs-12 HOTEL-BOOKING">
                                  {
                                    defaultSummary.vehicles.map((vehicle, key) => {
                                      if (vehicle._id === transportBooking.vehicleId) {
                                        return (
                                          <div>
                                            <p lassName="HOTEL-BOOKING1 HOTEL-BOOKING-Mobile">Vehicle: {vehicle.vehicleType}
                                            </p>
                                            <p lassName="HOTEL-BOOKING1 HOTEL-BOOKING-Mobile">Vehicle Number: {vehicle.vehicleNo}
                                            </p>
                                          </div>
                                        );
                                      }
                                    })
                                  }
                                </div>
                              </div>
                              <div className="row HOTEL-BOOKING"><p style={{ textAlign: "center", width: "100%" }}>{transportBooking.transportStartTime}, {transportBooking.transportStartDate.split(',')[0]} - {transportBooking.transportEndTime}, {transportBooking.transportEndDate.split(',')[0]}</p></div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                }
                {defaultSummary && defaultSummary.serviceBookings && defaultSummary.serviceBookings.length > 0 &&
                  <div>
                    <div className="card-header card-header-customized appGradientColor collapsed appBodyFontFamily" data-toggle="collapse" data-parent="#accordion" href="#collapseFour">
                      <a className="card-title"> <i className="icon-service-appointments" aria-hidden="true"></i>
                        SERVICE APPOINTMENTS
                  </a>
                    </div>
                    <div id="collapseFour" className="card-body myPreference-card-body appGradientColor appBodyFontFamily collapse appBodyFontColor" data-parent="#accordion" >
                      {
                        defaultSummary && defaultSummary.serviceBookings &&

                        defaultSummary.serviceBookings.map((serviceBooking, key) => {
                          return (
                            <div className="row">
                              <div className="col-md-4 col-sm-12 HOTEL-BOOKING">
                                <p>{serviceBooking.serviceDate}</p>
                              </div>
                              <div className="col-md-4 col-sm-6 HOTEL-BOOKING">
                                <p>{serviceBooking.serviceName}</p>
                              </div>
                              <div className="col-md-4 col-sm-6 text-right HOTEL-BOOKING">
                                <p>{serviceBooking.serviceTime}</p>
                              </div>
                              <div className="sa-padding d-md-none"></div>
                            </div>);
                        })
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    eventSummary: getEventSummary(state),
    guestSummaryFamily: getGuestSummaryFamily(state),
    eventId: getEventId(state),
    guestId: getGuestId(state)
  }
}
export default connect(mapStateToProps)(MySummary);
