import React from "react";
import "./destination.css";
import {
  getEventDetails,
  getDestinationDetails,
  getDestinations,
} from "../../selectors";
import { fetchEventDetails } from "../../api/eventDetailsApi";
import { connect } from "react-redux";
import get from "lodash/get";
import _ from "lodash";
import PlacesToVisit from "./placesToVisit";
import Slider from "react-slick";
import cloneDeep from "lodash/cloneDeep";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import "../../config/config.js";
import { checkIsUserLoggedIn } from "../../api/storageAPI";
import { browserHistory } from "react-router";
import $ from "jquery";
import { isMobile } from "../../config/config.js";
import "../common.css";
import Linkify from "react-linkify";

class destination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      destinationData: cloneDeep(props.destinationData),
      error1: "Image not found",
      defaultId: "0",
      showPlacesToVisit: false,
    };
    this.sessionEventId = "";
    this.sessionGuestId = "";
    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
      browserHistory.push("/");
    }
  }

  componentDidUpdate() {
    if (this.state.showPlacesToVisit) {
      $(".backIconMobile").hide();
      $("#chatBackIcon").show();

      $("#chatBackIcon").click(
        function (e) {
          $("#chatBackIcon").hide();
          e.preventDefault();
          this.setState({
            showPlacesToVisit: false,
          });
        }.bind(this)
      );
    }
  }

  componentDidMount() {
    if (!this.props.destinationData) {
      fetchWelcomeDetails();
    }
    $("html").scrollTop(0);
    this.sessionEventId = localStorage.getItem("eventId");
    this.sessionGuestId = localStorage.getItem("guestId");

    if (isMobile) {
      $("#spanHeaderText").html("DUBAI");
      $("body").addClass("additionalBG");
      $(".notificationBell").show();
      $(".appLogo").hide();
      $(".chat").show();
    }
    $(".slick-track").addClass("owl-stage");
    if (!this.props.eventDetails) {
      let flag = 1;
      fetchEventDetails(this.props.guestId || this.sessionGuestId, flag);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.destinationData) {
      fetchWelcomeDetails();
    }
    if (this.props.destinationData !== nextProps.destinationData) {
      this.setState({ destinationData: cloneDeep(nextProps.destinationData) });
    }
    $(".slick-track").addClass("owl-stage");
  }

  getDestinationDetails(event) {
    event.preventDefault();
    let id = get(event.target, "attributes['id'].value");
    let data =
      this.state.destinationData &&
      this.state.destinationData.filter((data) => {
        if (data.destinationId === id) {
          return data;
        }
      });
    //Slider fix
    setTimeout(function () {
      $(".slick-dots li:first-child button").click();
    }, 300);
    return this.setState({ defaultId: data[0].destinationId });
  }

  getDestinationToRender(destinationData) {
    if (this.state.defaultId === "0") {
      return destinationData[0];
    } else {
      let destinationDetails =
        this.state.destinationData &&
        this.state.destinationData.filter((data) => {
          if (data.destinationId === this.state.defaultId) {
            return data;
          }
        });
      return destinationDetails[0];
    }
  }
  openPlaceToVisit(event) {
    event.preventDefault();
    if (this.state.showPlacesToVisit === false) {
      this.setState({ showPlacesToVisit: true });
    }
  }

  showPlacesToVisitBtn(defaultDestination) {
    if (defaultDestination && defaultDestination.placesToVisitInclude) {
      return (
        <button
          name="button"
          className="commonBtnDestination appBodyFontFamily appBodyFontColor btn btn-default btn-responsive"
          onClick={this.openPlaceToVisit.bind(this)}
        >
          PLACES TO VISIT
        </button>
      );
    }
    return null;
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
    };
    let destinationData = this.state.destinationData;
    let allDestinations = this.props.destinations;
    let invitedEvents = this.props.eventDetails;
    let invitedEventDestinations = [];
    invitedEvents &&
      invitedEvents.map((a) => {
        invitedEventDestinations.push(a.subEventDestination);
      });
    invitedEventDestinations = _.uniq(invitedEventDestinations);
    let destinations = [];
    allDestinations &&
      allDestinations.map((a) => {
        if (_.includes(invitedEventDestinations, a.destinationName)) {
          destinations.push({
            destinationId: a.destinationId,
            destinationName: a.destinationName,
          });
        }
      });
    let destinationExist = destinations.length > 0 ? true : false;
    let destinationData2 = [];
    destinationData &&
      destinationData.map((a) => {
        if (_.includes(_.map(destinations, "destinationId"), a._id)) {
          destinationData2.push(a);
        }
      });
    let defaultDestination = this.getDestinationToRender(destinationData2);
    return (
      <div className="container resposiveHideHeading">
        <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block">
          DESTINATION
        </h3>
        {!this.state.showPlacesToVisit && destinationExist && (
          <div>
            <div className="row">
              <div className="col-md-12 destinationBtn mT90">
                <div className="d-none d-lg-block col-md-12 col-sm-12 col-xs-12">
                  {destinations &&
                    destinations.map((destination) => {
                      return (
                        <button
                          name="button"
                          className={`commonBtnDestination appBodyFontFamily appBodyFontColor btn btn-default btn-responsive ${
                            destination.destinationId ===
                            defaultDestination.destinationId
                              ? "active"
                              : ""
                          }`}
                          id={destination.destinationId}
                          key={destination.destinationName}
                          onClick={this.getDestinationDetails.bind(this)}
                        >
                          {destination.destinationName}
                        </button>
                      );
                    })}
                </div>
                <div className="d-md-block d-lg-none d-xl-none destinationMobile">
                  <div className="col-md-12 col-sm-12 col-xs-12 scrollMobile">
                    {destinations &&
                      destinations.map((destination) => {
                        return (
                          <button
                            name="button"
                            className={`commonBtnDestination appBodyFontFamily appBodyFontColor btn btn-default btn-responsive ${
                              destination.destinationId ===
                              defaultDestination.destinationId
                                ? "active"
                                : ""
                            }`}
                            id={destination.destinationId}
                            key={destination.destinationName}
                            onClick={this.getDestinationDetails.bind(this)}
                          >
                            {destination.destinationName}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            <div className="d-none d-sm-block">
              {destinationExist && defaultDestination && (
                <div className="row destinationImage">
                  <div className="card-deck destinationCls">
                    <div className="card destinationDetails appGradientColor">
                      <figure className="figure bridgeImage">
                        <img
                          src={defaultDestination.mainImage}
                          className="figure-img   img-responsive "
                          alt="image Not found"
                        />
                        <div className="destination-data appGradientColor">
                          <figcaption className="figure-caption appGradientColor appBodyFontColor">
                            <span className="mainheadingCommon appBodyFontFamily">
                              {defaultDestination.basicInfo.destinationName}
                            </span>
                            <p className="paragraphCommon appBodyFontFamily lineFormat">
                              <Linkify properties={{ target: "_blank" }}>
                                {defaultDestination.basicInfo.aboutDestination}
                              </Linkify>
                            </p>
                          </figcaption>
                        </div>
                      </figure>
                    </div>
                    {defaultDestination.otherDetailsInclude &&
                      defaultDestination.otherDetails && (
                        <div className="card destinationDetails appGradientColor">
                          <figure className="figure bridgeImage">
                            <img
                              src={defaultDestination.otherDetailsImage}
                              className="figure-img   img-responsive "
                              alt="image Not found"
                            />
                            <div className="destination-data appGradientColor">
                              <figcaption className="figure-caption appGradientColor appBodyFontColor">
                                <span className="subHeadingCommon appBodyFontFamily">
                                  Nearest Airport
                                </span>
                                <p className="appBodyFontColor paragraphCommon appBodyFontFamily">
                                  {
                                    defaultDestination.otherDetails
                                      .destinationAirportName
                                  }
                                </p>
                              </figcaption>
                              <figcaption className="figure-caption figcaptionSecondPadding appGradientColor appBodyFontColor">
                                <span className="subHeadingCommon appBodyFontFamily">
                                  Weather
                                </span>
                                <p className="paragraphCommon appBodyFontFamily">
                                  Max:{" "}
                                  {defaultDestination.otherDetails
                                    .destinationWeatherMax + " \xB0C"}
                                </p>
                                <p className="paragraphCommon appBodyFontFamily">
                                  Min:{" "}
                                  {defaultDestination.otherDetails
                                    .destinationWeatherMin + " \xB0C"}
                                </p>
                              </figcaption>
                              {defaultDestination.otherDetails
                                .destinationCurrency.length > 0 && (
                                <figcaption className="figure-caption  appGradientColor appBodyFontColor">
                                  <span className="subHeadingCommon appBodyFontFamily">
                                    Currency
                                  </span>
                                  {defaultDestination.otherDetails.destinationCurrency.map(
                                    (currency) => {
                                      if (
                                        currency &&
                                        currency.rate &&
                                        currency.from &&
                                        currency.to
                                      ) {
                                        return (
                                          <div key={currency.rate}>
                                            <span className="appBodyFontColor paragraphCommon appBodyFontFamily">
                                              1 {currency.from}
                                            </span>
                                            <i className="fa fa-arrows-h"></i>
                                            <span className="appBodyFontColor paragraphCommon appBodyFontFamily">
                                              {currency.to} {currency.rate}
                                            </span>
                                          </div>
                                        );
                                      }
                                    }
                                  )}
                                </figcaption>
                              )}
                              {/* ABL SAM BOC : ADD TIME ZONE */}
                              {defaultDestination.otherDetails
                                .destinationTimezone.length > 0 && (
                                <figcaption className="figure-caption appGradientColor appBodyFontColor">
                                  <span className="subHeadingCommon appBodyFontFamily">
                                    Time Zone
                                  </span>
                                  <p className="paragraphCommon appBodyFontFamily">
                                    {
                                      defaultDestination.otherDetails
                                        .destinationTimezone
                                    }
                                  </p>
                                </figcaption>
                              )}
                              {/* ABL SAM BOC : ADD TIME ZONE */}
                            </div>
                          </figure>
                        </div>
                      )}
                    {defaultDestination.destinationTipsInclude &&
                      defaultDestination.destinationTips && (
                        <div className="card destinationDetails appGradientColor">
                          <figure className="figure bridgeImage">
                            <img
                              src={defaultDestination.tipsImage}
                              className="figure-img  img-responsive "
                              alt="image Not found"
                            />
                            <div className="destination-data appGradientColor">
                              <figcaption className="figure-caption appGradientColor appBodyFontColor">
                                {defaultDestination.destinationTips &&
                                  defaultDestination.destinationTips.destinationDos.map(
                                    (data, i) => {
                                      return (
                                        <p
                                          className="paragraphCommon currencyp appBodyFontFamily"
                                          key={i}
                                        >
                                          {data}
                                        </p>
                                      );
                                    }
                                  )}
                              </figcaption>
                              <figcaption className="figure-caption figcaptionSecondPadding1 appGradientColor appBodyFontColor">
                                {defaultDestination.destinationTips &&
                                  defaultDestination.destinationTips.destinationDonts.map(
                                    (data, i) => {
                                      return (
                                        <p
                                          className="paragraphCommon currencyp appBodyFontFamily"
                                          key={i}
                                        >
                                          {data}
                                        </p>
                                      );
                                    }
                                  )}
                              </figcaption>
                            </div>
                          </figure>
                        </div>
                      )}
                  </div>
                  <div className="placesToVisitBtn w-100">
                    <div className="destinationBtn">
                      {this.showPlacesToVisitBtn(defaultDestination)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className="d-md-none d-lg-none d-xl-none destinationMobile"
              style={{ paddingTop: "60px" }}
            >
              {destinationExist && defaultDestination && (
                <div className="destinationImage">
                  <Slider {...settings}>
                    <div className="destinationDetails1 appGradientColor owl-item">
                      <figure className="figure bridgeImage">
                        <img
                          src={defaultDestination.mainImage}
                          className="figure-img   img-responsive "
                          alt="image Not found"
                        />
                        <div className="destination-data-mobile appGradientColor">
                          <figcaption className="figure-caption appGradientColor appBodyFontColor appBodyFontFamily">
                            <div className="about-destination">
                              <p
                                className="mobileHeadingFontSize"
                                style={{
                                  textAlign: "left",
                                  marginBottom: "10px",
                                }}
                              >
                                {" "}
                                {defaultDestination.basicInfo.destinationName}
                              </p>
                              <p
                                className="lineFormat ptvFixDestination"
                                style={{ fontSize: "14px", textAlign: "left" }}
                              >
                                <Linkify properties={{ target: "_blank" }}>
                                  {
                                    defaultDestination.basicInfo
                                      .aboutDestination
                                  }
                                </Linkify>
                              </p>
                            </div>
                            <div className="placesToVisitBtn">
                              <div className="destinationBtn">
                                {this.showPlacesToVisitBtn(defaultDestination)}
                              </div>
                            </div>
                          </figcaption>
                        </div>
                      </figure>
                    </div>
                    {defaultDestination.otherDetailsInclude &&
                      defaultDestination.otherDetails && (
                        <div className="destinationDetails1 appGradientColor owl-item">
                          <figure className="figure bridgeImage">
                            <img
                              src={defaultDestination.otherDetailsImage}
                              className="figure-img   img-responsive "
                              alt="image Not found"
                            />
                            <div className="destination-data-mobile appGradientColor">
                              <figcaption className="figure-caption appGradientColor appBodyFontColor">
                                <p
                                  className="subHeadingCommon appBodyFontFamily"
                                  style={{ textAlign: "left" }}
                                >
                                  Nearest Airport
                                </p>
                                <p className="paragraphCommon appBodyFontFamily">
                                  {
                                    defaultDestination.otherDetails
                                      .destinationAirportName
                                  }
                                </p>
                              </figcaption>
                              <figcaption className="figure-caption mobilefig appGradientColor appBodyFontColor">
                                <span className="subHeadingCommon appBodyFontFamily">
                                  Weather
                                </span>
                                <p className="paragraphCommon appBodyFontFamily">
                                  Max:{" "}
                                  {defaultDestination.otherDetails
                                    .destinationWeatherMax + " \xB0C"}
                                </p>
                                <p className="paragraphCommon appBodyFontFamily">
                                  Min:{" "}
                                  {defaultDestination.otherDetails
                                    .destinationWeatherMin + " \xB0C"}
                                </p>
                              </figcaption>
                              {defaultDestination.otherDetails
                                .destinationCurrency.length > 0 && (
                                <figcaption className="figure-caption mobilefig appGradientColor appBodyFontColor">
                                  <span className="subHeadingCommon appBodyFontFamily">
                                    Currency
                                  </span>
                                  {defaultDestination.otherDetails.destinationCurrency.map(
                                    (currency) => {
                                      if (
                                        currency &&
                                        currency.rate &&
                                        currency.from &&
                                        currency.to
                                      ) {
                                        return (
                                          <div key={currency.rate}>
                                            <span className="appBodyFontColor paragraphCommon appBodyFontFamily">
                                              1 {currency.from}
                                            </span>
                                            <i className="fa fa-arrows-h"></i>
                                            <span className="appBodyFontColor paragraphCommon appBodyFontFamily">
                                              {currency.to} {currency.rate}
                                            </span>
                                          </div>
                                        );
                                      }
                                    }
                                  )}
                                </figcaption>
                              )}
                              {/* ABL SAM BOC : ADD TIME ZONE */}
                              {defaultDestination.otherDetails
                                .destinationTimezone.length > 0 && (
                                <figcaption className="figure-caption mobilefig appGradientColor appBodyFontColor">
                                  <span className="subHeadingCommon appBodyFontFamily">
                                    Time Zone
                                  </span>
                                  <p className="paragraphCommon appBodyFontFamily">
                                    {
                                      defaultDestination.otherDetails
                                        .destinationTimezone
                                    }
                                  </p>
                                </figcaption>
                              )}
                              {/* ABL SAM BOC : ADD TIME ZONE */}
                            </div>
                          </figure>
                        </div>
                      )}
                    {defaultDestination.destinationTipsInclude &&
                      defaultDestination.destinationTips && (
                        <div className="destinationDetails1 appGradientColor owl-item">
                          <figure className="figure bridgeImage">
                            <img
                              src={defaultDestination.tipsImage}
                              className="figure-img  img-responsive "
                              alt="image Not found"
                            />
                            <div className="destination-data-mobile appGradientColor">
                              <figcaption className="figure-caption mobilefig appGradientColor appBodyFontColor">
                                {defaultDestination.destinationTips &&
                                  defaultDestination.destinationTips.destinationDos.map(
                                    (data, i) => {
                                      return (
                                        <p
                                          className="paragraphCommon currencyp appBodyFontFamily"
                                          key={i}
                                        >
                                          {data}
                                        </p>
                                      );
                                    }
                                  )}
                                {defaultDestination.destinationTips &&
                                  defaultDestination.destinationTips.destinationDonts.map(
                                    (data, i) => {
                                      return (
                                        <p
                                          className="paragraphCommon currencyp appBodyFontFamily"
                                          key={i}
                                        >
                                          {data}
                                        </p>
                                      );
                                    }
                                  )}
                              </figcaption>
                            </div>
                          </figure>
                        </div>
                      )}
                  </Slider>
                </div>
              )}
            </div>
          </div>
        )}
        {this.state.showPlacesToVisit && destination && (
          <PlacesToVisit
            places={defaultDestination.placesToVisit}
            images1={defaultDestination.placesToVisitImage1}
            images2={defaultDestination.placesToVisitImage2}
            images3={defaultDestination.placesToVisitImage3}
          />
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    destinationData: getDestinationDetails(state),
    destinations: getDestinations(state),
    eventDetails: getEventDetails(state),
  };
}
export default connect(mapStateToProps)(destination);
