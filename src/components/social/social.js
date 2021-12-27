import React, { Component } from 'react';
import { getWelcomeDetails, getEventId, getGuestId } from "../../selectors";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import { connect } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import $ from 'jquery';
import { checkIsUserLoggedIn } from '../../api/storageAPI';
import { browserHistory } from "react-router";
import { isMobile, AppTItle, AppShortName } from '../../config/config.js';

class Social extends Component {
  constructor(props) {
    super(props);
    this.state = {
      welcomeData: cloneDeep(props.welcomeData)
    };
    console.log("social page data ::::::::::::: ", this.props);
  }
  componentDidMount() {
    $('html').scrollTop(0);
  }
  componentDidMount() {
    if (!this.props.welcomeData) {
      fetchWelcomeDetails();
    }
    $('body').attr('class', '');
    $('body').addClass('appWelcomeBackground');
    if (isMobile) {
      $('#spanHeaderText').text('social');
      $(".notificationBell").show();
      $(".appLogo").hide()
      $(".chat").show();
    }
    $('html').scrollTop(0);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.welcomeData) {
      fetchWelcomeDetails();
    }
    if (this.props.welcomeData !== nextProps.welcomeData) {
      this.setState({ welcomeData: cloneDeep(nextProps.welcomeData) });
    }
  }
  render() {
    const { welcomeData = {} } = this.state;
    const fbLink = welcomeData && welcomeData.facebookLink;
    const twitterLink = welcomeData && welcomeData.twitterLink;
    const instaLink = welcomeData && welcomeData.instagramLink;
    let styles = {
      link: {
        maxWidth: '400px',
        padding: '15px',
      }
    }
    $('.backIcon').show();
    $('.backIconMobile').show();
    return (
      <div className="container-fluid respobsiveMarginTop contactusmaincontent">
        <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily">  </h3>
        <div className="">
          {fbLink &&
            <div className="row">
              <div className="col-sm-12 appGradientColor contactUs appBodyFontColor" style={styles.link}>
                <p className="appBodyFontFamily appBodyFontColor"><a target="_blank" href={fbLink} className="appBodyFontColor tel appBodyFontFamily"> <span>FACEBOOK</span></ a></p>
              </div>
            </div>
          }
          {twitterLink &&
            <div className="row">
              <div className="col-sm-12  appGradientColor contactUs appBodyFontColor" style={styles.link}>
                <p className="appBodyFontFamily appBodyFontColor"><a target="_blank" href={twitterLink} className="appBodyFontColor tel appBodyFontFamily"> <span>TWITTER</span></ a></p>
              </div>
            </div>
          }
          {instaLink &&
            <div className="row">
              <div className="col-sm-12  appGradientColor contactUs appBodyFontColor" style={styles.link}>
                <p className="appBodyFontFamily appBodyFontColor"><a target="_blank" href={instaLink} className="appBodyFontColor tel appBodyFontFamily"> <span>INSTAGRAM</span></ a></p>
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
    welcomeData: getWelcomeDetails(state),
    eventId: getEventId(state),
    guestId: getGuestId(state)
  }
}
export default connect(mapStateToProps)(Social);