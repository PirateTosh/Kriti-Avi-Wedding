import React, { Component } from 'react';
import { browserHistory } from "react-router";
import ConferenceTiledComponent from "./conferenceTiledComponent";
import _ from 'lodash';
import { submitRsvpDetails } from "../../api/guestRSVPApi"
import $ from 'jquery';
import cloneDeep from "lodash/cloneDeep";
import moment from 'moment';

export default class RsvpConferenceComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      guestId: props.guestId,
      eventDetailArr: [],
      currentDate: '',
      rsvpDetails: []

    }
    this.updateData = this.updateData.bind(this);
    this.submitRSDetails = this.submitRSDetails.bind(this);


  }

  getsubEvents = (event) => {
    const { guestId } = this.state;
    const { eventDetails } = this.props;
    const { guestInformation } = this.props;
    // console.log('Get SUBEVNT GUEST INFORMATION', guestInformation);
    // console.log('eventDetails', eventDetails);
    var currentGuestData = {};
    guestInformation && guestInformation.map((data) => {
      if (data._id == guestId) {
        currentGuestData = data;
      }
    });
    const invitedSubeventsId = (currentGuestData && currentGuestData.inviteStatus) ? currentGuestData.inviteStatus.filter(data => data.status == true) : {};
    // console.log('invvited subevt ids', invitedSubeventsId);

    // const subEvents = eventDetails.filter(data =>  data.subEventDate === event);
    const subEvents = eventDetails.filter(function (item) {
      var invited = false;
      var date_matched = item.subEventDate === event;
      invitedSubeventsId.map((data) => {
        if (data.status == true && data.subEventId == item._id) {
          invited = true;
        }
      });
      return invited && date_matched;
    });

    const sortedSubEvents = _.sortBy(subEvents, (inf) => {
      let timeString = inf.subEventDate + " " + inf.subEventStartTime;
      return new moment(timeString, "DD MMMM, YYYYn HH:mma");
    });

    this.setState({
      eventDetailArr: sortedSubEvents,
      currentDate: event,
      guestId: guestId
    })
    this.setState({
      rsvpDetails: this.props.rsvpDetails
    })


  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rsvpDetails: nextProps.rsvpDetails
    })
    // console.log('::::', nextProps);
  }

  submitRSDetails() {

    // submitRsvpDetails(this.state.guestId, this.state.subEventArray);
    // console.log('RSVP2: state', this.state);

    const evntArray = JSON.parse(JSON.stringify(this.state.eventDetailArr));
    const rsvpDetails = JSON.parse(JSON.stringify(this.state.rsvpDetails));

    const dataArr = [];
    // console.log('RSVP2: eventArray', evntArray);
    // console.log('RSVP2: rsvpDetails', rsvpDetails);

    for (let i = 0; i < evntArray.length; i++) {
      if (rsvpDetails) {
        for (let p = 0; p < rsvpDetails.length; p++) {
          if (rsvpDetails[p] && rsvpDetails[p].guestId === this.state.guestId) {
            // console.log(111);
            let rsvpInfo = rsvpDetails[p].rsvpInfo;
            for (let q = 0; q < rsvpInfo.length; q++) {
              // console.log(222);
              if (rsvpInfo[q].subEventDate === this.state.currentDate && evntArray[i].subEventStartTime === rsvpInfo[q].subEventStartTime
                && evntArray[i].subEventTitle === rsvpInfo[q].subEventTitle) {
                  // console.log(333);
                // console.log('final rsvp',rsvpInfo[q]);
                dataArr.push({ 'subeventId': rsvpInfo[q]._id, 'status': rsvpInfo[q].status })
              }
            }
          }
        }
      }
    }

    // console.log('::', dataArr);
    submitRsvpDetails(this.state.guestId, dataArr);
  }

  updateData(val) {
    // console.log('::::::::', val.getAttribute('data-name'), val.getAttribute('data-type'));
    // console.log('::::', this);
    const dataType = val.getAttribute('data-type');
    let status = null;
    if (dataType === 'ATTENDING') {
      status = true
    } else if (dataType === 'NOT ATTENDING') {
      status = false
    } else if (dataType === 'MAYBE') {
      status = 'Maybe'
    }
    let newrsvpDetails = JSON.parse(JSON.stringify(this.state.rsvpDetails));
    let targetSubEvent = [];
    for (let i = 0; i < newrsvpDetails.length; i++) {
      if (newrsvpDetails[i].guestId === this.state.guestId) {
        newrsvpDetails[i].rsvpInfo.map((info) => {
          if (info.subEventTitle === val.getAttribute('data-name') && (info._id == val.getAttribute('data-subeventid'))) {
            info.status = status
            targetSubEvent = info;
          }
        })
      }
    }
    let newUpdatedDetails = cloneDeep(newrsvpDetails);


    for (let j = 0; j < newUpdatedDetails.length; j++) {

      if (newUpdatedDetails[j].guestId === this.state.guestId) {
        newUpdatedDetails[j].rsvpInfo.map(function (rsvpData, index2) {
          if (rsvpData.subEventDate == targetSubEvent.subEventDate && rsvpData.subEventStartTime == targetSubEvent.subEventStartTime && targetSubEvent._id != rsvpData._id && (rsvpData.status == targetSubEvent.status == true)) {
            newUpdatedDetails[j].rsvpInfo[index2].status = false;
          }
        });
      }

    }

    // console.log('NEW RSVPDETAILS:', newrsvpDetails);
    // console.log('NEW MY RSVPDETAILS:', newUpdatedDetails);
    this.setState({
      rsvpDetails: newUpdatedDetails ? newUpdatedDetails : newrsvpDetails
    })

  }


  getGroupedEvents(eventDetailArr, rsvpDetails) {
    // console.log('::::', eventDetailArr);
    let finalObject = {}
    let finalObject2 = {}
    let finalObject3 = {}
    let evtArray = []
    eventDetailArr && eventDetailArr.map((detailArr) => {
      evtArray.push({ 'subEventStartTime': detailArr.subEventStartTime, 'subEventTitle': detailArr.subEventTitle, 'subEventId': detailArr._id })
    })
    let value_keys = []
    evtArray.map(evtArray => {
      value_keys.push(evtArray.subEventStartTime)
    })
    for (let i = 0; i < value_keys.length; i++) {
      finalObject[value_keys[i]] = []
      finalObject3[value_keys[i]] = []
    }
    for (let j = 0; j < evtArray.length; j++) {
      finalObject[evtArray[j].subEventStartTime].push(evtArray[j].subEventTitle)
      finalObject3[evtArray[j].subEventStartTime].push(evtArray[j].subEventId)
    }
    for (let i = 0; i < value_keys.length; i++) {
      finalObject2[value_keys[i]] = []
    }
    for (let j = 0; j < evtArray.length; j++) {
      if (rsvpDetails) {
        for (let p = 0; p < rsvpDetails.length; p++) {
          if (rsvpDetails[p] && rsvpDetails[p].guestId === this.state.guestId) {
            let rsvpInfo = rsvpDetails[p].rsvpInfo;
            for (let q = 0; q < rsvpInfo.length; q++) {
              if (rsvpInfo[q].subEventDate === this.state.currentDate && evtArray[j].subEventStartTime === rsvpInfo[q].subEventStartTime
                && evtArray[j].subEventTitle === rsvpInfo[q].subEventTitle) {
                finalObject2[rsvpInfo[q].subEventStartTime].push(rsvpInfo[q].status)
              }
            }
          }
        }
      }



      // finalObject2[evtArray[j].status].push(evtArray[j].status)
    }
    return { finalObject: finalObject, finalObject2: finalObject2, finalObject3: finalObject3 };
  }
  getSubEventsByGuest2(guest) {
    this.setState({ guestId: guest._id });
    setTimeout(function () {
      $('.dateRow button.btn.active').click();
    }, 500);

  }
  componentDidUpdate(oldState, newData) {
    // if(oldState.guestId!=newData.guestId){
    //  $('.dateRow button.btn:first-child').click();
    // }
  }
  render() {
    // const { guestId } = this.props;
    var guestId = this.state.guestId;

    const { guestInformation, eventDetails, rsvpDetails, eventDateArray, eventDetailArr, currentGuestData, getSubEventsByGuest } = this.props;
    var eventArray = []
    // var eventsArray;

    if (this.state.eventDetailArr) {
      var eventsArray = []
      var eventsArrayStatus = []
      var eventsIdArray = []
      eventsArray = (this.getGroupedEvents(this.state.eventDetailArr, this.state.rsvpDetails)).finalObject;
      eventsArrayStatus = (this.getGroupedEvents(this.state.eventDetailArr, this.state.rsvpDetails)).finalObject2;
      eventsIdArray = (this.getGroupedEvents(this.state.eventDetailArr, this.state.rsvpDetails)).finalObject3;
    }

    // console.log('@@@@@@@@@', currentGuestData);

    let rsvpData = null;
    // rsvpDetails && rsvpDetails.rsvpInfo && rsvpDetails.rsvpInfo.map((data) => {
    //  if (data.subEventDate === this.state.currentDate && data.subEventStartTime ===) {
    //    rsvpData[this.state.cu]data;
    //  }
    // });

    // console.log(':::', rsvpData);

    return (
      <div className="container-fluid resposivemarginTopRSVP">
        <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily">RSVP</h3>
        <div className="row">
          <div className="myPassportBtnTop">
            <div className="BtnCommon responsiveBtn rsvpConference">
              {
                guestInformation && guestInformation.map((guest, i) => {
                  return <button className={`btn btn commonBtnDestination appBodyFontFamily appBodyFontColor ${guestId == guest._id && 'active'}`} onClick={() => (this.getSubEventsByGuest2(guest))} key={i}>{guest.guestFirstName}</button>
                })
              }
            </div>
          </div>
        </div>
        <div className="BtnCommon resposiveVisile dateRow rsvpConference">
          {
            eventDateArray.map((event, i) => {
              return <button className={`btn commonBtnDestination appBodyFontFamily appBodyFontColor ${(event === this.state.currentDate) ? "active" : ""}`} key={i} onClick={() => { this.getsubEvents(event) }}>{event.split(',')[0]}</button>
            })
          }
        </div>
        <ConferenceTiledComponent eventsIdArray={eventsIdArray} eventsArray={eventsArray} eventsArrayStatus={eventsArrayStatus} title="ATTENDING" updateData={this.updateData} accordion="accordionOne" collapse="collapseOne" />
        <ConferenceTiledComponent title="MAYBE" eventsIdArray={eventsIdArray} eventsArray={eventsArray} eventsArrayStatus={eventsArrayStatus} accordion="accordiontwo" updateData={this.updateData} collapse="collapseTwo" />
        <ConferenceTiledComponent title="NOT ATTENDING" eventsIdArray={eventsIdArray} eventsArray={eventsArray} eventsArrayStatus={eventsArrayStatus} accordion="accordionThree" updateData={this.updateData} collapse="collapseThree" />
        <br />
        <div className="BtnCommon responsiveBtn rsvpConference">
          <button className="btn commonBtnDestination appBodyFontFamily appBodyFontColor submitRsvp" onClick={this.submitRSDetails}>SUBMIT</button>
        </div>
      </div>
    )
  }
}
