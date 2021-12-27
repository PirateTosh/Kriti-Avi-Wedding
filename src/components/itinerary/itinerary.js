import React, { Component } from 'react';
import './itienarary.css';
import { getItineraryDetails, getItineraries } from "../../selectors";
import { connect } from "react-redux";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import {isMobile, AppTItle, AppShortName} from  '../../config/config.js';
import '../common.css';
import $ from 'jquery';
import {checkIsUserLoggedIn} from '../../api/storageAPI';
import {browserHistory} from "react-router";
import moment from 'moment';


class Itinerary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itineraryData: cloneDeep(props.itineraryData),
            defaultDate: "0",
            defaultDetails: []
        };
        if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
            browserHistory.push("/");
        }
    }

    componentDidMount() {
        $('body').attr('class','');
        $('body').addClass('appItineraryBackground');

        if (!this.props.itineraryData) {
            fetchWelcomeDetails();
        }
        $('html').scrollTop(0) ;

        if(isMobile){
            $("#spanHeaderText").html("Itinerary");
                $(".notificationBell").show();
                $(".appLogo").hide()
                $(".chat").show();
          }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.itineraryData) {
            //  fetchWelcomeDetails();
        }
        if (this.props.itineraryData !== nextProps.itineraryData) {
            this.setState({ itineraryData: cloneDeep(nextProps.itineraryData) });
        }
    }

    getItineraryDetails(event) {
        event.preventDefault();
        var guestData=(JSON.parse(localStorage.getItem('currentGuest')));
        var invitedSubevents=[];
        (guestData.inviteStatus).map(subevent=>{
            if(subevent.status){
                invitedSubevents.push(subevent.subEventId);
            }
        });
        let date = get(event.target, "textContent");
        let data = this.props.itineraryDetails && this.props.itineraryDetails.filter(data => {
            if (data.date === date && (typeof data.subEventId == 'undefined'||data.subEventId=="common"||invitedSubevents.indexOf(data.subEventId)>-1)) {
                return data;
            }
        });

        if(data[0] && data[0].date){
        return this.setState({ defaultDate: data[0].date });
    }

    }
    getItineraryToRender(itinerary) {
        var guestData=(JSON.parse(localStorage.getItem('currentGuest')));
        var invitedSubevents=[];
        (guestData.inviteStatus).map(subevent=>{
            if(subevent.status){
                invitedSubevents.push(subevent.subEventId);
            }
        });
        if (this.state.defaultDate === "0") {
            let firstItineraryDate = itinerary[0]?itinerary[0].date:"";
            let itineraryData = this.props.itineraryDetails && this.props.itineraryDetails.filter(data => {
                if (data.date === firstItineraryDate && (typeof data.subEventId == 'undefined'||data.subEventId == 'common'||(invitedSubevents.indexOf(data.subEventId)>-1))) {
                    return data;
                }
            });
            return itineraryData&&itineraryData.sort(function(d1,d2){
                var time1=moment(d1.startTime,'hh:mmA');
                var time2=moment(d2.startTime,'hh:mmA');
                return (time2.diff(time1)>0)?-1:1;                               
            });
            //return itineraryData;
        }
        else {
            let itineraryData = this.props.itineraryDetails && this.props.itineraryDetails.filter(data => {
                if (data.date === this.state.defaultDate && (typeof data.subEventId == 'undefined'||data.subEventId == 'common'||(invitedSubevents.indexOf(data.subEventId)>-1))) {
                    return data;
                }
            });
            
            return itineraryData&&itineraryData.sort(function(d1,d2){
                var time1=moment(d1.startTime,'hh:mmA');
                var time2=moment(d2.startTime,'hh:mmA');
                return (time2.diff(time1)>0)?-1:1;                               
            });
        }
    }

    render() {
        $('.backIcon').show();
        $('.backIconMobile').show();

        const { itineraryDetails, itineraries } = this.props;
        
        let sorteddet = itineraries && [].slice.call(itineraries).sort( function (d1, d2) {
                 return (new Date(d1.date) < new Date(d2.date)?-1:1)
            });
        let defaultItinerary = itineraryDetails && this.getItineraryToRender(sorteddet);

        const myScrollbar = {
          width: 400,
          height: 400,
        };
            
            itineraries && itineraries.sort( function (d1, d2) {
            return (new Date(d1.date) - new Date(d2.date))
       });
        return (
            <div className="container-fluid  itienararyBtn">
                <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block">ITINERARY</h3>
                <div className="row mT90">
                        <div className="d-none d-lg-block col-md-12 col-sm-12 col-xs-12">
                            {itineraries && itineraries.map(itinerary => {
                                return <button name="button" className={`btn btn-default btn-responsive appBodyFontFamily appBodyFontColor commonBtnDestination ${(itinerary.date === defaultItinerary[0].date) ? "active" : ""}`} key={itinerary._id} onClick={this.getItineraryDetails.bind(this)}>{itinerary.date}</button>
                            })}
                        </div>
                        <div className="d-md-block d-lg-none d-xl-none destinationMobile">
                            <div className="col-md-12 col-sm-12 col-xs-12 scrollMobile itinery">
                            {itineraries && itineraries.map(itinerary => {
                                return <button name="button" className={`btn btn-default btn-responsive appBodyFontFamily appBodyFontColor commonBtnDestination ${(itinerary.date === defaultItinerary[0].date) ? "active" : ""}`} key={itinerary._id} onClick={this.getItineraryDetails.bind(this)}>{itinerary.date}</button>
                            })}
                            </div>
                        </div>
                    
                </div>
                {
                    defaultItinerary &&
                    <div>
                        <div className="row d-none d-sm-block itineraryCls">
                            <div className="appGradientColor itineraryBody" style={{paddingTop:'20px',paddingBottom:'20px'}}>

                                {
                                    defaultItinerary.map((defaultIti, key) => {
                                        var iconName;
                                        if(defaultIti.selectIcon==='common')
                                        {
                                            iconName='icon-common-itinerary fa-plane-itinerary';
                                        }
                                        else if(defaultIti.selectIcon==='food')
                                        {
                                            iconName='icon-food-itineray-and-meal fa-plane-itinerary';
                                        }
                                        else if(defaultIti.selectIcon==='event')
                                        {
                                            iconName='icon-event-details fa-plane-itinerary';
                                        }
                                        else if(defaultIti.selectIcon==='travel')
                                        {
                                            iconName='icon-travel-itinerary fa-plane-itinerary';
                                        }
                                        else if(defaultIti.selectIcon==='transport')
                                        {
                                            iconName='icon-transport fa-plane-itinerary';
                                        }
                                        else if(defaultIti.selectIcon==='hotel')
                                        {
                                            iconName='icon-hotel-itinerary fa-plane-itinerary';
                                        }
                                        else if(defaultIti.selectIcon==='tour')
                                        {
                                            iconName='icon-tour fa-plane-itinerary';
                                        }
                                        if(key === 0)
                                        {
                                            return(
                                                <div className="row" key={defaultIti._id}>

                                                    <div className="col-md-5"></div>
                                                    <div className="col-md-2">

                                                        <div className=" iconDiv">
                                                            <i className={iconName}  aria-hidden="true"></i>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 itineraryp appBodyFontFamily appBodyFontColor">
                                                        <p className="mobileHeadingFontSize">{defaultIti.startTime} {defaultIti.endTime.replace("12:34PM", "Onwards")}</p>
                                                        <p >{defaultIti.description}</p>

                                                    </div>
                                                </div>
                                            );
                                        }
                                        else if (key % 2 === 0) {
                                            return(
                                                <div>
                                                  <div className="row">
                                                        <div className="borderSummaryItinerary"></div>
                                                    </div>
                                                    <div style={{marginBottom : '-10px'}} className="row" key={defaultIti._id}>

                                                        <div className="col-md-5"></div>
                                                        <div className="col-md-2">

                                                            <div className=" iconDiv">
                                                                <i className={iconName}  aria-hidden="true"></i>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-5 itineraryp appBodyFontFamily appBodyFontColor">
                                                            <p className=" mobileHeadingFontSize">{defaultIti.startTime} - {defaultIti.endTime.replace("12:34PM", "Onwards")}</p>
                                                            <p className=" mobileParagraphFontSize">{defaultIti.description}</p>

                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return(
                                                <div>
                                                    <div className="row">
                                                        <div className="borderSummaryItinerary"></div>
                                                    </div>
                                                    <div className="row"  key={defaultIti._id}>

                                                        <div className="col-md-5 itinerarypRight appBodyFontFamily appBodyFontColor">
                                                            <p >{defaultIti.startTime} - {defaultIti.endTime.replace("12:34PM", "Onwards")}</p>
                                                            <p >{defaultIti.description}</p>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <div className=" iconDiv">
                                                                <i className={iconName} aria-hidden="true"></i>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-5"></div>

                                                    </div>
                                                </div>

                                            );
                                        }

                                    })
                                }
                            </div>
                        </div>
                        <div className="row d-md-none d-lg-none d-xl-none">
                            <div className="col-xs-12 col-sm-12 appGradientColor" style={{paddingTop:'20px',paddingBottom:'20px', marginTop: '20px'}}>

                                {
                                    defaultItinerary.map((defaultIti, key) => {
                                        var iconName;
                                        if(defaultIti.selectIcon==='common')
                                        {
                                            iconName='icon-common-itinerary fa-plane-itinerary';
                                        }
                                        else if(defaultIti.selectIcon==='food')
                                        {
                                            iconName='icon-food-itineray-and-meal fa-plane-itinerary';
                                        }
                                        else if(defaultIti.selectIcon==='event')
                                        {
                                            iconName='icon-event-details fa-plane-itinerary';
                                        }
                                        else if(defaultIti.selectIcon==='travel')
                                        {
                                            iconName='icon-travel-itinerary fa-plane-itinerary';
                                        }
                                        else if(defaultIti.selectIcon==='transport')
                                        {
                                            iconName='icon-transport fa-plane-itinerary';
                                        }
                                        else if(defaultIti.selectIcon==='hotel')
                                        {
                                            iconName='icon-hotel-itinerary fa-plane-itinerary';
                                        }
                                        else if(defaultIti.selectIcon==='tour')
                                        {
                                            iconName='icon-tour fa-plane-itinerary';
                                        }
                                        if(key === 0)
                                        {
                                            return (

                                                <div style={{alignItems: 'center'}} className="row" key={defaultIti._id}>
                                                    <div className="col-md-2 col-sm-2 col-xs-2 itineraryMobileIcon"
                                                         style={{float: "left"}}>
                                                        <div className=" iconDiv">
                                                            <i className={iconName} aria-hidden="true"></i>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="col-md-10 col-sm-10 col-xs-10 itineraryp itinerarymobile appBodyFontFamily appBodyFontColor"
                                                        style={{float: "left"}}>
                                                        <p className="mobileHeadingFontSize">{defaultIti.startTime} <span>-</span> {defaultIti.endTime.replace("12:34PM", "Onwards")}</p>
                                                        <p className="mobileParagraphFontSize">{defaultIti.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        else {
                                            // let endTime = defaultIti.endTime === "12:34PM"? "Onwards from let" : defaultIti.endTime;
                                           
                                            return (

                                                <div>
                                                    <div className="row">
                                                        <div className="borderSummaryItineraryMobile"></div>
                                                    </div>
                                                    <div style={{alignItems: 'center'}} className="row" key={defaultIti._id}>
                                                        <div className="col-md-2 col-sm-2 col-xs-2 itineraryMobileIcon"
                                                             style={{float: "left"}}>
                                                            <div className=" iconDiv">
                                                                <i className={iconName} aria-hidden="true"></i>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="col-md-10 col-sm-10 col-xs-10 itineraryp itinerarymobile appBodyFontFamily appBodyFontColor"
                                                            style={{float: "left"}}>
                                                            <p className="mobileHeadingFontSize">{defaultIti.startTime} <span>-</span> {defaultIti.endTime.replace("12:34PM", "Onwards")}</p>
                                                            <p className="mobileParagraphFontSize">{defaultIti.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                    })
                                }
                            </div>
                        </div>
                    </div>
                }

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        itineraryDetails: getItineraryDetails(state),
        itineraries: getItineraries(state)
    }
}

export default connect(mapStateToProps)(Itinerary);
