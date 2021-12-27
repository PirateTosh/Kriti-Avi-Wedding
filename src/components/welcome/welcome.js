import React from "react";
import "../dashboard/dashboard.css";
import { getWelcomeDetails, getEventId, getGuestId } from "../../selectors";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import { connect } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import $ from "jquery";
import { checkIsUserLoggedIn } from "../../api/storageAPI";
import { browserHistory } from "react-router";
import { isMobile, AppTItle, AppShortName } from "../../config/config.js";
import Linkify from "react-linkify";

class dashboard extends React.Component {
  constructor(props) {
    super(props);
    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
      browserHistory.push("/");
    }
  }
  componentDidMount() {
    // console.log("WELCOME PROPS ::::::::::::::::::::::", this.props);
    let pageTitle =
      this.props.welcomeData && this.props.welcomeData.welcomeTitle;
    if (!this.props.welcomeData) {
      fetchWelcomeDetails();
    }
    if (this.props.welcomeData && !this.props.welcomeData.welcomeVideo) {
      $("#youClickDiv2 #youIcon2").remove();
    }
    $("body").attr("class", "");
    $("body").addClass("appWelcomeBackground");
    if (isMobile) {
      $("#spanHeaderText").html(pageTitle);
      $(".notificationBell").show();
      $(".appLogo").hide();
      $(".chat").show();
    }
    $("html").scrollTop(0);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.welcomeData) {
      fetchWelcomeDetails();
    }
  }
  playAndPauseButton(welcomeData) {
    if (welcomeData) {
      let url = welcomeData.welcomeVideo;
      let id = typeof url !== "undefined" ? url.split("/") : [];
      let videoUrl =
        typeof id[3] !== "undefined"
          ? "https://www.youtube.com/embed/" +
            id[3] +
            "?autoplay=1&controls=1&showinfo=0&autohide=1"
          : "";
      return videoUrl;
    }
    return null;
  }

  changeText(message) {
    if (message) {
      let arrayItem = message.split("\n");
      let text = arrayItem.map(item => {
        return item;
      });
      return text;
    }
    return null;
  }
  hideModal() {
    $(".modal-content").hide();
    $("iframe").attr("src", $("iframe").attr("src"));
    $(".fa-youtube-play").show();
  }
  playVideo() {
    const { welcomeData } = this.props;
    let url = welcomeData.welcomeVideo ? welcomeData.welcomeVideo : "";
    if (url) {
      $(".modal-content").fadeIn();
      $(".youTubeAttribute").attr("src", url);
      $("#video").height($(".modal-body").height() - 40);
      $(".fa-youtube-play").hide();
    }
  }

  componentDidUpdate() {
    if (this.props.welcomeData && !this.props.welcomeData.welcomeVideo) {
      $("#youClickDiv2 #youIcon2").remove();
    }
  }
  render() {
    let guestNickName = "";
    if (
      localStorage.getItem("guestAddressing") === null ||
      localStorage.getItem("guestAddressing") === ""
    ) {
      guestNickName = localStorage.getItem("guestFirstName");
    } else {
      guestNickName = localStorage.getItem("guestAddressing");
    }

    $(".backIcon").show();
    $(".backIconMobile").show();
    const welcomeData = this.props.welcomeData;
    let videoSrc = welcomeData && this.playAndPauseButton(welcomeData);
    let msg = welcomeData && welcomeData.welcomeMessage;
    let text = msg && this.changeText(msg);
    let welcomeImage =
      welcomeData && welcomeData.welcomeImage ? welcomeData.welcomeImage : "";
    // let welcomeBG =welcomeData && welcomeData.welcomeBackground ? welcomeData.welcomeBackground : "";
    // if (welcomeBG.length > 0) {
    //   $('body').css('background-image', "url('" + welcomeBG + "')");
    // }
    return (
      <div>
        <div
          className="modal-content"
          style={{
            display: "none",
            position: "absolute",
            top: "0px",
            width: "100%",
            height: "100%"
          }}
        >
          <div className="modal-body" style={{ padding: "0px" }}>
            <span
              className="corss"
              onClick={this.hideModal.bind(this)}
              style={{
                color: "white",
                position: "absolute",
                left: "10px",
                cursor: "pointer",
                background: "#ff8000",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                fontSize: "18px",
                paddingTop: "10px",
                paddingLeft: "17px",
                zIndex: "1",
                top: "8%"
              }}
            >
              X
            </span>

            <iframe
              className="youTubeAttribute"
              id="video"
              src=""
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
        <div className="container">
          <div className="Dashboard-Center Dashboard-Center-welcome Dashboard-Center-welcome  is-Responsive">
            <div className="invitationBox">
              <div className="videoContainer">
                <div
                  onClick={this.playVideo.bind(this)}
                  className="youTubeIcon"
                  id="youClickDiv2"
                >
                  <i className="fa fa fa-youtube-play" id="youIcon2" />
                  <img src={welcomeImage} className="dashboardImage" />
                </div>
              </div>
              <div className="invitationMessage appGradientColor appBodyFontColor appBodyFontFamily">
                <p
                  className="paragraphCommon appBodyFontFamily  appBodyFontColor text-capitalize"
                  style={{ fontWeight: "400" }}
                >
                  Dear {guestNickName},
                </p>
                {text && text.length > 0 && (
                  <div
                    className="appBodyFontFamily paragraphCommon appBodyFontColor"
                    style={{ marginTop: "10px" }}
                  >
                    {
                      // text.map((lines) =>
                      <p className="lineFormat">
                        <Linkify properties={{ target: "_blank" }}>
                          {msg}
                        </Linkify>
                      </p>
                      // )
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
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
  };
}
export default connect(mapStateToProps)(dashboard);
