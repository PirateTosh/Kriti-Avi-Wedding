import React, { Component } from 'react';
import { getGuestFamily, getGuestFlights, getGuestInformation } from "../../selectors";
import { fetchGuestFlight, guestFlightDelete, fetchAirlineList, fetchAirportList } from '../../api/flightApi'
import { fetchGuestInformation } from "../../api/guestInformationApi";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import _ from 'lodash'
import cloneDeep from "lodash/cloneDeep";
import $ from 'jquery';
import './bookedTicket.css'

class bookedTicket extends Component {
  constructor(props){
    super(props);
    this.state = {
      tickedBooked : false,
      currentGuestId : localStorage.getItem('guestId'),
      guestFlights : this.props.guestFlights
    }
    this.onDelete = this.onDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.guestFlights !== nextProps.guestFlights) {
      let guestFlights = cloneDeep(nextProps.guestFlights);
      this.setState({ guestFlights: guestFlights });
    }
  }

  componentDidMount(){
    $('.backIcon').show();
    $('.backIconMobile').show();
    fetchAirlineList();
    fetchAirportList();
    fetchGuestInformation(this.state.currentGuestId);
    fetchGuestFlight(this.state.currentGuestId);
    console.log("PROPS ::: ", this.props, "STATE ::", this.state)
  }

  onDelete(id){
    guestFlightDelete(id)
    fetchGuestFlight(this.state.currentGuestId)
    let tickets = this.state.guestFlights.filter((a) => {
      return a._id !== id;
    })
    console.log('ticket lists :::: ', tickets);
    this.setState({guestFlights : tickets})
  }

  setGuest(guestId) {
    let { guestFamily } = this.props;
    let currentGuest = guestFamily.find(m => {
      return m.guestId === guestId;
    });
    
    this.setState({
      currentGuestId: guestId,
      guestInformation: currentGuest,
      guestFlights : fetchGuestFlight(guestId)
    })
  }

  render(){
    const { guestFamily } = this.props;
    let { guestFlights } = this.props;
    let empList = _.isEmpty(guestFlights)
    return(
      <div className="booked-ticket">
      <div className="row">
      <div className="myPassportBtnTop">
          {guestFamily && guestFamily.map(guest => {
            return <button className={`btn btn-default btn-responsive ankur appBodyFontFamily appBodyFontColor ${(guest.guestId === this.state.currentGuestId) ? "active" : ""}`} key={guest.guestId} id={guest.guestId} onClick={() => {
              this.setGuest(guest.guestId);
            }}>{guest.guestName}</button>
          })}
        </div>
      </div>        
        <div className="already-booked">
          { empList ? (
            ''
          ) : <div className="page-title">Booked Tickets</div>
          }
          <div className="ticket-list">
          { guestFlights && guestFlights.map(a =>{
              return <Ticket tickets={a} onDelete={this.onDelete.bind(this)}/>
            })
          }
          </div>
        </div>
        <div className="page-title">Add new Tickets</div>
        <div className="links">
          <a className="card-header myInformation-card-header appBodyFontColor appGradientColor" onClick={() => {browserHistory.push("/travel/book-ticket")}}>Enter Ticket Details</a>
          <a className="card-header myInformation-card-header appBodyFontColor appGradientColor" onClick={() => {browserHistory.push("/travel/upload-ticket")}}>Upload Tickets</a>
        </div>
      </div>
    )
  }
}

class Ticket extends Component {
  constructor(props){
    super(props);
    this.state = {
      tickedBooked : false,
      tickets : []
    }
  }

  deleteFlight(e){
    e.preventDefault();
    this.props.onDelete(this.props.tickets._id)
  }

  render(){
    let flights = this.props.tickets;
    return(
      <div className="ticket appGradientColor appBodyFontColor">
        <div className="pnr">
          <p>PNR No. {flights.pnr}</p>
          <p>Flight No. {flights.flightNo}</p>
        </div>
        <div className="airline">
          {flights.airline}
        </div>
        <div className="airport">
          Departure From {flights.depCity} at {flights.depTime}
        </div>
        <div className="airport">
          Arrival in {flights.arrCity} at {flights.arrTime}
        </div>
        <div className="appBodyFontColor text-center mobileBtnBridge appBodyFontFamily flex-center" onClick={this.deleteFlight.bind(this)}>Delete</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
	return {
    guestFamily: getGuestFamily(state),
    guestFlights : getGuestFlights(state),
    guestInformation: getGuestInformation(state),
    guestFamily: getGuestFamily(state)
	}
}

export default connect(mapStateToProps)(bookedTicket);