import React, { Component } from 'react';
import './eventDetails.css';
import { connect } from "react-redux";
import { getEventDetails, getEventId, getGuestId, getEventByDate } from "../../selectors";
import { fetchEventDetails } from "../../api/eventDetailsApi";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import { isMobile } from '../../config/config.js';
import $ from 'jquery';
import '../common.css';
import Slider from 'react-slick';
import { checkIsUserLoggedIn } from '../../api/storageAPI';
import { browserHistory } from "react-router";
import moment from 'moment';
import Linkify from "react-linkify";
class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventDetails: cloneDeep(props.eventDetails),
      defaultId: "0"
    };
    this.sessionEventId = '';
    this.sessionGuestId = '';
    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
      browserHistory.push("/");
    }
  }
  componentDidMount() {
    this.sessionEventId = localStorage.getItem('eventId');
    this.sessionGuestId = localStorage.getItem('guestId');

    if (!this.props.eventDetails) {
      fetchEventDetails(this.props.guestId || this.sessionGuestId);
    }
    let maxHeight = 0;

    $(".eventDetDiv").each(function () {
      if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
    });

    $(".eventDetDiv").height(maxHeight);

    if (isMobile) {
      $("#spanHeaderText").html("Event Details");
      $(".notificationBell").show();
      $(".appLogo").hide()
      $(".chat").show();
    }
  }

  componentDidUpdate() {
    let maxHeight = 0;
    $(".eventDetDiv").each(function () {
      if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
    });
    $('html').scrollTop(0);
    $(".slick-track").addClass("owl-stage");
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.eventDetails) {
      fetchEventDetails(this.props.guestId || this.sessionGuestId);
    }
    if (this.props.eventDetails !== nextProps.eventDetails) {
      this.setState({ eventDetails: cloneDeep(nextProps.eventDetails) });
    }
    $(".slick-track").addClass("owl-stage");
  }

  getEventDetails(event) {
    event.preventDefault();
    let date = get(event.target, "textContent");
    let data = this.state.eventDetails && this.state.eventDetails.filter(data => {
      if (data.subEventDate === date) {
        return data;
      }
    });

    setTimeout(function () {
      $('.slick-dots li:first-child button').click();
    }, 300);

    return this.setState({ defaultId: data[0].subEventDate });
  }

  getdirectionButton(link) {
    if (link) {
      return (
        <a className="eventBtnDirection" target="_blank" href={link}>GET DIRECTION</a>
      )
    }
    return null
  }

  getEventToRender(eventDetails) {
    if (this.state.defaultId === "0") {
      let firstItineraryDate = eventDetails[0] && eventDetails[0].subEventDate;
      let eventData = this.state.eventDetails && this.state.eventDetails.filter(data => {
        if (data.subEventDate === firstItineraryDate) {
          return data;
        }
      });

      return eventData && eventData.sort(function (d1, d2) {
        var time1 = moment(d1.subEventStartTime, 'hh:mmA');
        var time2 = moment(d2.subEventStartTime, 'hh:mmA');
        return (time2.diff(time1) > 0) ? -1 : 1;

      });
    }
    else {
      let eventData = this.state.eventDetails && this.state.eventDetails.filter(data => {
        if (data.subEventDate === this.state.defaultId) {
          return data;
        }
      });

      return eventData && eventData.sort(function (d1, d2) {
        var time1 = moment(d1.subEventStartTime, 'hh:mmA');
        var time2 = moment(d2.subEventStartTime, 'hh:mmA');
        return (time2.diff(time1) > 0) ? -1 : 1;

      });
    }
  }
  render() {

    $('.backIcon').show();
    $('.backIconMobile').show();

    const { eventDetails = {} } = this.state;
    let { eventByDate } = this.props;
    let sorteddet = [].slice.call(eventDetails).sort(function (d1, d2) {
      return (new Date(d1.subEventDate) < new Date(d2.subEventDate) ? -1 : 1)
    });

    let defaultEvent = this.getEventToRender(sorteddet);

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      initialSlide: 0
    };
    const mobSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      initialSlide: 0
    };
    eventByDate && eventByDate.sort(function (d1, d2) {
      return (new Date(d1.subEventDate) - new Date(d2.subEventDate))
    });
    return (
      <div className="container eventDetailsBtn">
        <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block">EVENT DETAILS</h3>
        <div className="mT90">
          <div className="eventBtnCls d-none d-lg-block col-md-12 col-sm-12 col-xs-12">
            {eventByDate && eventByDate.map(event => {
              return <button className={` BtnCommon btn appBodyFontFamily appBodyFontColor commonBtnDestination ${(event.subEventDate === defaultEvent[0].subEventDate) ? "active" : ""}`} id={event.eventId} key={event._id} onClick={this.getEventDetails.bind(this)}>{event.subEventDate}</button>
            })}
          </div>
          <div className="d-md-block d-lg-none d-xl-none destinationMobile">
            <div className="col-md-12 col-sm-12 col-xs-12 scrollMobile">
              {eventByDate && eventByDate.map(event => {
                return <button className={` BtnCommon btn appBodyFontFamily appBodyFontColor commonBtnDestination ${(event.subEventDate === defaultEvent[0].subEventDate) ? "active" : ""}`} id={event.eventId} key={event._id} onClick={this.getEventDetails.bind(this)}>{event.subEventDate}</button>
              })}
            </div>
          </div>
        </div>
        <div className="d-none d-sm-block">

          {defaultEvent &&
            <div className="destinationImage">
              <div className="eventDetailsCls">
                <Slider {...settings} >
                  {defaultEvent.map(defaultEve => {
                    return (
                      <div className="eventDetDiv owl-item" key={defaultEve._id}>
                        <figure className="figure bridgeImage appGradientColor">
                          <img src={defaultEve.subEventImg} className="figure-img img-fluid img-responsive " alt='image Not found' />
                          <figcaption className="figure-caption appBodyFontColor appBodyFontFamily">
                            <p className="eventDatailsP mainheadingCommon appBodyFontFamily"> {defaultEve.subEventTitle}</p>
                            <p className='paragraphCommon appBodyFontFamily'> {defaultEve.subEventStartTime} - {defaultEve.subEventEndTime.replace("12:34PM", "Onwards")}</p>
                            {defaultEve.subEventTab1Content && defaultEve.subEventTab1Content.length > 0 && defaultEve.subEventTab1Content != 'TBA' && defaultEve.subEventTab1Content != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily"> {defaultEve.subEventTab1}:</p>
                                <p className='paragraphCommon appBodyFontFamily'>{defaultEve.subEventTab1Content}</p>
                              </p>
                            }
                            {defaultEve.subEventTab2Content && defaultEve.subEventTab2Content.length > 0 && defaultEve.subEventTab2Content != 'TBA' && defaultEve.subEventTab2Content != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily">{defaultEve.subEventTab2}:</p>
                                <p className='paragraphCommon appBodyFontFamily'>{defaultEve.subEventTab2Content}</p>
                              </p>
                            }
                            {defaultEve.subEventTab3Content && defaultEve.subEventTab3Content.length > 0 && defaultEve.subEventTab3Content != 'TBA' && defaultEve.subEventTab3Content != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily">{defaultEve.subEventTab3}:</p>
                                <p className='paragraphCommon appBodyFontFamily'>{defaultEve.subEventTab3Content}</p>
                              </p>
                            }
                            {defaultEve.subEventLocation && defaultEve.subEventLocation.length > 0 && defaultEve.subEventLocation != 'TBA' && defaultEve.subEventLocation != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily">Location:</p>
                                <p className='paragraphCommon appBodyFontFamily'>{defaultEve.subEventLocation}</p>
                              </p>
                            }
                            {defaultEve.subEventDescription && defaultEve.subEventDescription.length > 0 && defaultEve.subEventDescription != 'TBA' && defaultEve.subEventDescription != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily"> Description:</p>
                                <p className='paragraphCommon appBodyFontFamily lineFormat'><Linkify properties={{ target: '_blank' }}>{defaultEve.subEventDescription}</Linkify></p>
                              </p>
                            }
                            {defaultEve.subEventLocationLink && defaultEve.subEventLocationLink.length > 0 && defaultEve.subEventLocationLink != 'TBA' && defaultEve.subEventLocationLink != 'NA' &&
                              <div className="eventDetailsBtnCenter">
                                {this.getdirectionButton(defaultEve.subEventLocationLink)}
                              </div>
                            }
                          </figcaption>
                        </figure>
                      </div>
                    )
                  })}
                </Slider>
              </div>
            </div>
          }
        </div>
        <div className="d-md-none d-lg-none d-xl-none d-none destinationMobile">
          {defaultEvent &&
            <div className="row destinationImage">
              <div className="eventDetailsCls">
                {defaultEvent.map(defaultEve => {
                  return (
                    <div className="eventDetDiv" key={defaultEve._id}>
                      <figure className="figure bridgeImage">
                        <img src={defaultEve.subEventImg} className="figure-img img-fluid img-responsive " alt='image Not found' />
                        <figcaption className="figure-caption appBodyFontColor appBodyFontFamily" >
                          <p className="eventDatailsP mainheadingCommon appBodyFontFamily"> {defaultEve.subEventTitle}</p>
                          <p className='paragraphCommon appBodyFontFamily'> {defaultEve.subEventStartTime} - {defaultEve.subEventEndTime.replace("12:34PM", "Onwards")}</p>
                          {defaultEve.subEventTab1Content && defaultEve.subEventTab1Content.length > 0 && defaultEve.subEventTab1Content != 'TBA' && defaultEve.subEventTab1Content != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily"> {defaultEve.subEventTab1}:</p>
                                <p className='paragraphCommon appBodyFontFamily'>{defaultEve.subEventTab1Content}</p>
                              </p>
                            }
                            {defaultEve.subEventTab2Content && defaultEve.subEventTab2Content.length > 0 && defaultEve.subEventTab2Content != 'TBA' && defaultEve.subEventTab2Content != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily">{defaultEve.subEventTab2}:</p>
                                <p className='paragraphCommon appBodyFontFamily'>{defaultEve.subEventTab2Content}</p>
                              </p>
                            }
                            {defaultEve.subEventTab3Content && defaultEve.subEventTab3Content.length > 0 && defaultEve.subEventTab3Content != 'TBA' && defaultEve.subEventTab3Content != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily">{defaultEve.subEventTab3}:</p>
                                <p className='paragraphCommon appBodyFontFamily'>{defaultEve.subEventTab3Content}</p>
                              </p>
                            }
                            {defaultEve.subEventLocation && defaultEve.subEventLocation.length > 0 && defaultEve.subEventLocation != 'TBA' && defaultEve.subEventLocation != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily">Location:</p>
                                <p className='paragraphCommon appBodyFontFamily'>{defaultEve.subEventLocation}</p>
                              </p>
                            }
                            {defaultEve.subEventDescription && defaultEve.subEventDescription.length > 0 && defaultEve.subEventDescription != 'TBA' && defaultEve.subEventDescription != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily"> Description:</p>
                                <p className='paragraphCommon appBodyFontFamily lineFormat'><Linkify properties={{ target: '_blank' }}>{defaultEve.subEventDescription}</Linkify></p>
                              </p>
                            }
                            {defaultEve.subEventLocationLink && defaultEve.subEventLocationLink.length > 0 && defaultEve.subEventLocationLink != 'TBA' && defaultEve.subEventLocationLink != 'NA' &&
                              <div className="eventDetailsBtnCenter">
                                {this.getdirectionButton(defaultEve.subEventLocationLink)}
                              </div>
                            }
                          </figcaption>
                        </figure>
                    </div>
                  )
                })}
              </div>
            </div>
          }
        </div>
        <div className="d-md-none d-lg-none d-xl-none destinationMobile">
          {defaultEvent &&
            <div className="destinationImage">
              <div className="eventDetailsCls">
                <Slider {...mobSettings}>
                  {defaultEvent.map(defaultEve => {
                    return (
                      <div className="eventDetDiv  owl-item appGradientColor" key={defaultEve._id}>
                        <figure className="figure bridgeImage">
                          <img src={defaultEve.subEventImg} className="figure-img img-fluid img-responsive " alt='image Not found' />
                          <figcaption className="figure-caption  appGradientColor appBodyFontColor appBodyFontFamily" >
                            <p className="eventDatailsP mainheadingCommon appBodyFontFamily"> {defaultEve.subEventTitle}</p>
                            <p className='paragraphCommon appBodyFontFamily'> {defaultEve.subEventStartTime} - {defaultEve.subEventEndTime.replace("12:34PM", "Onwards")}</p>
                            {defaultEve.subEventTab1Content && defaultEve.subEventTab1Content.length > 0 && defaultEve.subEventTab1Content != 'TBA' && defaultEve.subEventTab1Content != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily"> {defaultEve.subEventTab1}: </p>
                                <p className='paragraphCommon appBodyFontFamily'> {defaultEve.subEventTab1Content}</p>
                              </p>
                            }
                            {defaultEve.subEventTab2Content && defaultEve.subEventTab2Content.length > 0 && defaultEve.subEventTab2Content != 'TBA' && defaultEve.subEventTab2Content != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily">{defaultEve.subEventTab2}: </p>
                                <p className='paragraphCommon appBodyFontFamily'>{defaultEve.subEventTab2Content}</p>
                              </p>
                            }
                            {defaultEve.subEventTab3Content && defaultEve.subEventTab3Content.length > 0 && defaultEve.subEventTab3Content != 'TBA' && defaultEve.subEventTab3Content != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily">{defaultEve.subEventTab3}:</p>
                                <p className='paragraphCommon appBodyFontFamily'>{defaultEve.subEventTab3Content}</p>
                              </p>
                            }
                            {defaultEve.subEventLocation && defaultEve.subEventLocation.length > 0 && defaultEve.subEventLocation != 'TBA' && defaultEve.subEventLocation != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily">Location:</p>
                                <p className='paragraphCommon appBodyFontFamily'> {defaultEve.subEventLocation}</p>
                              </p>
                            }

                            {defaultEve.subEventDescription && defaultEve.subEventDescription.length > 0 && defaultEve.subEventDescription != 'TBA' && defaultEve.subEventDescription != 'NA' &&
                              <p>
                                <p className="subHeadingCommon appBodyFontFamily"> Description:</p>
                                <p className='paragraphCommon appBodyFontFamily lineFormat'><Linkify properties={{ target: '_blank' }}>{defaultEve.subEventDescription}</Linkify></p>
                              </p>
                            }
                            {defaultEve.subEventLocationLink && defaultEve.subEventLocationLink.length > 0 && defaultEve.subEventLocationLink != 'TBA' && defaultEve.subEventLocationLink != 'NA' &&
                              <div className="eventDetailsBtnCenter">
                                {this.getdirectionButton(defaultEve.subEventLocationLink)}
                              </div>
                            }
                          </figcaption>
                        </figure>
                      </div>
                    )
                  })}
                </Slider>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    eventDetails: getEventDetails(state),
    eventId: getEventId(state),
    guestId: getGuestId(state),
    eventByDate: getEventByDate(state)
  }
}

export default connect(mapStateToProps)(EventDetails)