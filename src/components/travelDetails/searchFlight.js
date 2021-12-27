import React, { Component } from 'react';
import Meteor from "react-web-meteor";
import DatePicker from 'react-datepicker';
import { guestFlightAddNew, fetchAirportList, fetchGuestFlight } from '../../api/flightApi'
import { fetchGuestInformation } from "../../api/guestInformationApi";
import { getEventId, getGuestId, getAirportList, getGuestFlights, getGuestFamily, getGuestInformation } from "../../selectors";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import $ from 'jquery';
import './searchFlight.css'
import moment from 'moment';
import _ from 'lodash';
import AirportList from './airportList'
import AirportList2 from './airportList2'
import AirlineList from './airlineList'

class searchFlight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      foundFlight : [],
      showResult : false,
      showError : false,
      guestFlights : [],
      flightDate : moment(),
      currentGuestId : localStorage.getItem('guestId'),
    };
    this.handleChange = this.handleChange.bind(this);
    this.setGuest = this.setGuest.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    let searchData = {
      flightIATA : event.target.iata.value,
      flightNo : event.target.flightno.value,
      flightDate : this.state.flightDate,
      depAir : event.target.depAir.value,
      arrAir : event.target.arrAir.value,
    }
    this.flightSearch(searchData);
  }

  handleChange(momentDate) {
    const date = momentDate ? momentDate.format('YYYY/MM/DD') : undefined;
    this.setState({
      flightDate: date
    });
  }

  setGuest(guestId) {
    let { guestFamily } = this.props;
    let currentGuest = guestFamily.find(m => {
      return m.guestId === guestId;
    });

    this.setState({
      currentGuestId: guestId,
      guestInformation: currentGuest
    })
    console.log('statexxx:::',this.state);
  }

  flightSearch(data){
    Meteor.call('search.flight', data, (err, res) => {
      if(err){
        console.log('flight search error', err);
        this.setState({showResult : false})
        this.setState({showError : true})
      } else {
        console.log('flight result :::', res)

        let depInfo = _.findKey(res, {'departureAirportFsCode' : data.depAir})
        let arrInfo = _.findKey(res, {'arrivalAirportFsCode' : data.arrAir})
        if(depInfo && arrInfo){
          let xyz = [{
            carrierFsCode : res[depInfo].carrierFsCode,
            flightNumber : res[depInfo].flightNumber,
            departureAirportFsCode : res[depInfo].departureAirportFsCode,
            departureTime : res[depInfo].departureTime,
            departureTerminal : res[depInfo].departureTerminal,
            arrivalAirportFsCode : res[arrInfo].arrivalAirportFsCode,
            arrivalTime : res[arrInfo].arrivalTime,
            arrivalTerminal : res[arrInfo].arrivalTerminal,
          }]
          this.setState({foundFlight : xyz})
        } else {
          console.log('Airport Not Found :::: ', err);
          this.setState({showResult : false})
          this.setState({showError : true})
          this.setState({foundFlight : ''})
        }
        if(this.state.foundFlight.length > 0){
          this.setState({showResult : true})
          this.setState({showError : false})
        } else {
          this.setState({showResult : false})
          this.setState({showError : true})
        }

        let winHeight = window.innerHeight;
        $('body').scrollTop(winHeight);
        }
      })
  }
  
  componentWillMount(){
    fetchAirportList();
    fetchGuestFlight(this.state.currentGuestId);
    fetchGuestInformation(this.state.currentGuestId);
  }

  componentDidMount(){
    $('.backIcon').show();
    $('.backIconMobile').show();
    fetchGuestFlight(this.state.currentGuestId);
    fetchGuestInformation(this.state.currentGuestId);
    this.setState({guestFlights : this.props.guestFlights});
  }

  render(){
    let list = this.state.foundFlight;
    const { guestFamily, guestInformation } = this.props;
    let currentGuest = guestFamily && guestFamily.find(m => {
      return m.guestId === this.state.currentGuestId;
    });
    return(
      <div className="search-flight">
        <div className="page-title">Add New Flight</div>
        <div className="row">
        <div className="myPassportBtnTop" style={{paddingBottom: '20px'}}>
          {guestFamily && guestFamily.map(guest => {
            return <button className={`btn btn-default btn-responsive ankur appBodyFontFamily appBodyFontColor ${(guest.guestId === this.state.currentGuestId) ? "active" : ""}`} key={guest.guestId} id={guest.guestId} onClick={() => {
              this.setGuest(guest.guestId);
            }}>{guest.guestName}</button>
          })}
        </div>
        </div>
        
        <form className="appGradientColor appBodyFontColor appBodyFontFamily" onSubmit={this.handleSubmit.bind(this)}>
          <AirlineList name="iata"/>
          <div className="form-group">
            <label htmlFor="flightno">Flight Number</label> <br/>
            <input className="form-control form-control-color appBodyFontFamily appBodyFontColor" placeholder="For example: 122, 335, 160" name="flightno" type="text"/>
          </div>
          <div className="form-group">
            <label htmlFor="">Departure Date:</label> <br/>
            <DatePicker className="form-control form-control-color appBodyFontFamily appBodyFontColor" 
              name="flightdate"
              id="flightdate"
              value = {this.state.flightDate}
              onChange={this.handleChange}
              readOnly={true}
              calendarClassName="rasta-stripes"
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              showDisabledMonthNavigation
              dateFormat="YYYY/MM/DD"
              dropdownMode="select"
            />
          </div>
          <AirportList name="depAir" id="depAir"/>
          <AirportList2 name="arrAir" id="arrAir"/>
          <div className="flex-center">
            <input className="appBodyFontColor text-center mobileBtnBridge appBodyFontFamily" type="submit" value="Search"/>
          </div>
        </form>
        {this.state.showResult ? (
          <div className="show-result">
            {list.map(item =>
              <FoundFlight key={item.referenceCode} flight={item} guest={this.state.currentGuestId}/>
            )}
          </div>
        ) : null}
        {this.state.showError ? (
          <div className="show-error">
            <p>FLIGHT NOT FOUND, PLEASE CHECK THE INFOMATION AND TRY AGAIN.</p>
          </div>
        ) : null
        }
      </div>
    )
  }
}
class FoundFlight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  componentDidMount(){
    this.nameInput.focus();
  }

  selecteData(e){
    e.preventDefault();
    let data = {
      agencyProvided : false,
      guestId : this.props.guest,
      eventId : localStorage.getItem('eventId'),
      pnrNumber : e.target.flightPNR.value,
      
      airlineIATA : this.props.flight.carrierFsCode,
      flightNo : this.props.flight.flightNumber,
      departureAirport : this.props.flight.departureAirportFsCode,
      departureTime : this.props.flight.departureTime,
      departureTerminal : this.props.flight.departureTerminal,
      arrivalAirport : this.props.flight.arrivalAirportFsCode,
      arrivalTime : this.props.flight.arrivalTime,
      arrivalTerminal : this.props.flight.arrivalTerminal,
    }
    console.log('selected data', data)
    guestFlightAddNew(data);
    fetchGuestFlight(localStorage.getItem('guestId'));
    browserHistory.push("/travel/booked-ticket");
  }
  render(){
    return( 
      <div key={this.props.flight.referenceCode} className="flight-card appGradientColor appBodyFontColor">
        <div className="flight-content">
          <div>
            <h5>Departure Info</h5>
            <p>Airpot :: {this.props.flight.departureAirportFsCode}</p>
            <p>Time :: {this.props.flight.departureTime}</p>
            <p>Terminal :: {this.props.flight.departureTerminal}</p>
          </div>
          <div>
            <h5>Arrival Info</h5>
            <p>Airpot :: {this.props.flight.arrivalAirportFsCode}</p>
            <p>Time :: {this.props.flight.arrivalTime}</p>
            <p>Terminal :: - </p>
          </div>
        </div>
        <form onSubmit={this.selecteData.bind(this)}>
          <div className="form-group">
            <label htmlFor="flightPNR">PNR No.</label>
            <input ref={(input) => { this.nameInput = input; }} name="flightPNR" className="form-control form-control-color appBodyFontFamily appBodyFontColor" type="text" />
          </div>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <button type="submit" className="appBodyFontColor text-center mobileBtnBridge appBodyFontFamily">Save</button>
          </div>
        </form>
      </div>
    )
  }
}

function mapStateToProps(state) {
	return {
		eventId: getEventId(state),
    guestId: getGuestId(state),
    airportList : getAirportList(state),
    guestFlights : getGuestFlights(state),
    guestFamily: getGuestFamily(state),
    guestInformation: getGuestInformation(state)
	}
}

export default connect(mapStateToProps)(searchFlight);