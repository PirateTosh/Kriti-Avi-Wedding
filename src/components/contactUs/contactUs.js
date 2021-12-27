import React, { Component } from 'react';
import './contactUs.css';
import { connect } from "react-redux";
import { getContactDetails, getEventId } from "../../selectors";
import cloneDeep from "lodash/cloneDeep";
import $ from 'jquery';
import { isMobile, AppShortName } from '../../config/config.js';
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import { checkIsUserLoggedIn } from '../../api/storageAPI';
import { browserHistory } from "react-router";

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactData: cloneDeep(props.contactData)
    };
    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() !== "true") {
      browserHistory.push("/");
    }
  }
  componentDidMount() {
    $('body').attr('class', '');
    $('body').addClass('appContactBackground');
    fetchWelcomeDetails();
    if (isMobile) {
      $("#spanHeaderText").html("Contact Us");
      $(".notificationBell").show();
      $(".appLogo").hide()
      $(".chat").show();
    }
    $('html').scrollTop(0);

  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.contactData) {
      fetchWelcomeDetails();
    }
    if (this.props.contactData !== nextProps.contactData) {
      this.setState({ contactData: cloneDeep(nextProps.contactData) });
    }
  }
  render() {
    $('.backIcon').show();
    $('.backIconMobile').show();
    const responsive = {
      0: {
        items: 1
      }
    };
    const { contactData = {} } = this.state;
    let contacts = contactData.contactItems;
    return (
      <div className="container-fluid respobsiveMarginTop contactusmaincontent">
        <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block">CONTACT US{contactData && contactData.contactTitle}</h3>
        <div className=" mT90ContactUs">
          {
            contacts && contacts.map(contact => {
              return (
                <div className="row">
                  <div className="col-sm-4 col-xs-12  appGradientColor contactUs appBodyFontColor">
                    <p className="appBodyFontFamily appBodyFontColor">{contact.name}<br /><a href={'tel:' + contact.number} className="appBodyFontColor tel appBodyFontFamily"> <span>{contact.number}</span></ a></p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    contactData: getContactDetails(state),
    eventId: getEventId(state),
  }
}

export default connect(mapStateToProps)(ContactUs);