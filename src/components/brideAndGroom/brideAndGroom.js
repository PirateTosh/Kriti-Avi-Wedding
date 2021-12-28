import React from "react";
import { Route } from "react-router-dom";
import "./brideAndGroom.css";
import { getEventId, getWelcomeDetails } from "../../selectors";
import { connect } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import Slider from "react-slick";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import { isMobile, AppTItle, AppShortName } from "../../config/config.js";
import "../common.css";
import $ from "jquery";
import { fetchAppDetails } from "../../api/appDetApi";
import { getAppDetails } from "../../selectors";
import { checkIsUserLoggedIn } from "../../api/storageAPI";
import { browserHistory } from "react-router";
import Linkify from "linkifyjs/react";
import _ from "lodash";

class brideAndGroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      welcomeData: cloneDeep(props.welcomeData),
      appDetails: cloneDeep(props.appDetails),
    };
    this.sessionEventId = "";
    this.sessionGuestId = "";
    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
      browserHistory.push("/");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.welcomeData) {
      fetchWelcomeDetails();
    }
    if (this.props.welcomeData !== nextProps.welcomeData) {
      this.setState({ welcomeData: cloneDeep(nextProps.welcomeData) });
    }
    if (this.props.appDetails !== nextProps.appDetails) {
      let appDetails = cloneDeep(nextProps.appDetails);
      this.setState({ appDetails: appDetails });
      if (isMobile) {
        if (appDetails.basicDetails.eventType === "wedding") {
          $("#spanHeaderText").html("Kriti & Avi");
        } else {
          $("#spanHeaderText").html("About");
        }
      }
    }
  }

  componentDidMount() {
    $("body").attr("class", "");
    $("body").addClass("additionalBG");
    fetchAppDetails();
    let appDetails = cloneDeep(this.props.appDetails);
    this.setState({ appDetails: appDetails });
    if (!this.props.welcomeData) {
      fetchWelcomeDetails(this.props.eventId);
    }
    $("html").scrollTop(0);
    this.sessionEventId = localStorage.getItem("eventId");
    this.sessionGuestId = localStorage.getItem("guestId");
    if (isMobile) {
      $("#spanHeaderText").html("Kriti & Avi");
      $(".notificationBell").show();
      $(".appLogo").hide();
      $(".chat").show();
      $(".slick-track").addClass("owl-stage");
    }
  }
  render() {
    $(".backIcon").show();
    $(".backIconMobile").show();
    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
    };
    const { welcomeData = {} } = this.state;
    let aboutBG = welcomeData.abountPageBackground
      ? welcomeData.abountPageBackground
      : "";
    let pages = welcomeData.aboutpages;
    let appdet = this.state.appDetails;
    if (aboutBG.length > 0) {
      $("body").css("background-image", "url('" + aboutBG + "')");
    }
    return (
      <div className="container about-page">
        {appdet &&
          appdet.basicDetails &&
          appdet.basicDetails.eventType === "wedding" && (
            <h3 className="headingTop headingTopMobile  d-none d-sm-block appBodyFontColor appBodyFontFamily">
              Kriti & Avi
            </h3>
          )}
        {appdet &&
          appdet.basicDetails &&
          appdet.basicDetails.eventType !== "wedding" && (
            <h3 className="headingTop headingTopMobile  d-none d-sm-block appBodyFontColor appBodyFontFamily">
              ABOUT
            </h3>
          )}
        <Slider {...settings}>
          {pages &&
            pages.map((a) => {
              return (
                <div className="bridegroomCls">
                  <button
                    className="appBodyFontColor text-center mobileBtnBridge appBodyFontFamily"
                    style={{ textAlign: "center", marginBottom: "60px" }}
                  >
                    {a.aboutPageTitle}
                  </button>
                  <div className="bridegroom">
                    <figure className="figure figure1">
                      <img
                        src={a.aboutPageImg}
                        className="figure-img img-fluid img-responsive "
                      />
                      <figcaption className="figure-caption  appGradientColor appBodyFontFamily appBodyFontColor">
                        <span className="mainheadingCommon">
                          {a.aboutPageTitle}
                        </span>
                        <p className="appBodyFontColor paragraphCommon lineFormat">
                          <Linkify
                            properties={{
                              target: "_blank",
                              style: { fontWeight: "100" },
                            }}
                          >
                            {a.aboutPageContent}
                          </Linkify>
                        </p>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              );
            })}
        </Slider>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    welcomeData: getWelcomeDetails(state),
    eventId: getEventId(state),
    appDetails: getAppDetails(state),
  };
}

export default connect(mapStateToProps)(brideAndGroom);
