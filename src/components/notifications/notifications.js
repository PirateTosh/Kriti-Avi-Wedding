import React, { Component } from 'react';
import './notifications.css';
import {connect} from "react-redux";
import _ from "lodash";
import moment from "moment";
import {getContactDetails, getEventId} from "../../selectors";
import {isMobile, AppTItle, AppShortName} from  '../../config/config.js';
import cloneDeep from "lodash/cloneDeep";
import $ from 'jquery';
import Linkify from "react-linkify";
import {fetchWelcomeDetails} from "../../api/welcomeApi";
import {checkIsUserLoggedIn} from '../../api/storageAPI';
import {browserHistory} from "react-router";
import Meteor from "react-web-meteor";
import store from "../../store";
import {mySummaryAction} from "../../actions/summary.action";

class Notifications extends Component {
    constructor(props){
        super(props);
        this.state={
            contactData : cloneDeep(props.contactData),
            notificationsData : ''
        };
        if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
            browserHistory.push("/");
        }
        this.sessionEventId = '';
        this.sessionGuestId = '';
    }
    componentDidMount(){
        this.sessionEventId = localStorage.getItem('eventId');
      this.sessionGuestId = localStorage.getItem('guestId');
      localStorage.setItem('notificationCount', 0);
        let eventId = this.props.eventId || this.sessionEventId;
        let guestId = this.props.guestId || this.sessionGuestId;
        Meteor.call("fetch.guest.notifications", {eventId:eventId, guestId:guestId}, function (error, result) {
            if (error) {
                console.log(error);
            } else {
                let notificationList = _.sortBy(result, m => {
                    let time = m.time ? m.time : Date.now();
                    let formatted = moment(time);
                    return formatted.format('YYYYMMDD');
                }).reverse();
                this.setState({
                    notificationsData: notificationList
                });
                }
        }.bind(this));
        $('html').scrollTop(0) ;

        if(isMobile){
            $("#spanHeaderText").html("NOTIFICATION");
                $(".notificationBell").hide();
                $(".appLogo").hide()
                $(".chat").hide();
                $('.headingTop').hide();

          }
    }
    render(){
        $('.backIcon').show();
        $('.backIconMobile').show();

        const responsive = {

            0: {

                items: 1

            }
        };
        //const {contactData = {}}= this.state;
        let notifications = this.state.notificationsData;
        //console.log(notifications);
        return(
            <div className="container-fluid respobsiveMarginTop contactusmaincontent">
                <div style={{marginTop:"60px"}}>
                    <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily">Notifications</h3>
                    <div className="mobileMargin">
                    {
                        notifications && notifications.map(notification =>{
                            return (
                                    <div className="row">
                                        <div className="col-sm-12 col-xs-12 col-md-6 col-lg-6 appGradientColor notifications appBodyFontColor">
                                            <span className="notificationTitle appBodyFontColor appBodyFontFamily" style={{textDecoration:'underline',paddingBottom:'10px'}}> {notification.title}</span>
                                            <div className="clearfix"></div>
                                            <span className="notificationBody appBodyFontColor appBodyFontFamily lineFormat"><Linkify properties={{target: '_blank', style: {fontWeight: 'normal'}}}>{notification.body}</Linkify></span>
                                            <div className="clearfix"></div>
                                            <span className="notificationDate appBodyFontColor appBodyFontFamily" style={{float:"right"}}>
                                                {moment(notification.time).calendar()}
                                            </span>
                                        </div>
                                    </div>
                            )
                        })
                    }
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        contactData: getContactDetails(state),

        eventId: getEventId(state),
    }
}

export default connect(mapStateToProps)(Notifications);
