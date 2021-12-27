import React, { Component } from 'react';

import { connect } from "react-redux";
import { browserHistory } from "react-router";
import $ from 'jquery';
import './bookedTicket.css'

class bookTicket extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('.backIcon').show();
    $('.backIconMobile').show();
  }

  render() {
    return (
      <div className="booked-ticket">
        <div className="page-title">Add new Tickets</div>
        <div className="links">
          <a className="card-header myInformation-card-header appBodyFontColor appGradientColor" onClick={() => { browserHistory.push("/travel/flight-search") }}>Enter Arrival Ticket Details</a>
          <a className="card-header myInformation-card-header appBodyFontColor appGradientColor" onClick={() => { browserHistory.push("/travel/flight-search") }}>Enter Departure Ticket Details</a>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {

  }
}

export default connect(mapStateToProps)(bookTicket);