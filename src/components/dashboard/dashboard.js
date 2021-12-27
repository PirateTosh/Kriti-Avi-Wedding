import React from "react";
import "./dashboard.css";
import {
  getGuestAddressing,
  getEventId,
  getGuestId,
  getWelcomeDetails,
  getEventName,
  getGuestFirstName,
  getGuestLastName
} from "../../selectors";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import cloneDeep from "lodash/cloneDeep";
import "../../config/config.js";
import $ from "jquery";
import { checkIsUserLoggedIn } from "../../api/storageAPI";
import Linkify from "react-linkify";

class dashboard extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $("body").addClass("appBody");
    if (!this.props.welcomeData) {
      fetchWelcomeDetails(this.props.eventId);
    }
    if (this.props.welcomeData && !this.props.welcomeData.welcomeVideo) {
      $("#youClickDiv #youIcon").remove();
    }
    $("html").scrollTop(0);
  }

  playAndPauseButton(welcomeData) {
    if (welcomeData) {
      let url = welcomeData.welcomeVideo;
      let id = url.split("/");
      let videoUrl =
        "https://www.youtube.com/embed/" +
        id[3] +
        "?autoplay=0&controls=1&showinfo=0&autohide=1";
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

  setLocalStorage(
    eventId,
    guestId,
    isLoggedIn,
    eventName,
    guestFirstName,
    guestLastName,
    guestAddressing
  ) {
    window.localStorage.setItem("eventId", eventId);
    window.localStorage.setItem("guestId", guestId);
    window.localStorage.setItem("isLoggedIn", isLoggedIn);
    window.localStorage.setItem("guestFirstName", guestFirstName);
    window.localStorage.setItem("guestLastName", guestLastName);
    window.localStorage.setItem("guestAddressing", guestAddressing);
  }

  componentDidUpdate() {
    if (this.props.guestId || this.sessionEventId) {
      this.setLocalStorage(
        this.props.eventId,
        this.props.guestId,
        true,
        this.props.eventName,
        this.props.guestFirstName,
        this.props.guestLastName,
        this.props.guestAddressing
      );
    }
    if (this.props.welcomeData && !this.props.welcomeData.welcomeVideo) {
      $("#youClickDiv #youIcon").remove();
    }
  }

  render() {
    const { welcomeData } = this.props;
    let videoSrc = this.playAndPauseButton(welcomeData);
    let msg = welcomeData && welcomeData.welcomeMessage;
    let text = this.changeText(msg);
    let guestNickName = "";
    if (
      localStorage.getItem("guestAddressing") === null ||
      localStorage.getItem("guestAddressing") === ""
    ) {
      guestNickName = localStorage.getItem("guestFirstName");
    } else {
      guestNickName = localStorage.getItem("guestAddressing");
    }
    let welcomeVideo = "";
    let welcomeImage = "";
    if (welcomeData) {
      welcomeVideo = welcomeData.welcomeVideo ? welcomeData.welcomeVideo : "";
      welcomeImage = welcomeData.welcomeImage ? welcomeData.welcomeImage : "";
      let welcomeBG = welcomeData.welcomeBackground
        ? welcomeData.welcomeBackground
        : "";
      if (welcomeBG.length > 0) {
        $("body").css("background-image", "url('" + welcomeBG + "')");
      }
    }

    return (
      <div>
        <div
          className="modal-content"
          style={{
            display: "none",
            zIndex: "999999999",
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
                paddingLeft: "10px",
                fontSize: "18px",
                paddingTop: "10px",
                paddingLeft: "17px"
              }}
            >
              X
            </span>
            <iframe
              className="youTubeAttribute"
              id="video"
              src=""
              allow="autoplay"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
        <div className="container">
          <div className="Dashboard-Center is-Responsive">
            <div className="invitationBox">
              <div className="videoContainer">
                <div
                  onClick={this.playVideo.bind(this)}
                  className="youTubeIcon"
                  id="youClickDiv"
                >
                  <i className="fa fa-youtube-play" id="youIcon" />
                  <img src={welcomeImage} className="dashboardImage" />
                </div>
              </div>
              <div className="invitationMessage appGradientColor appFontColor">
                <p
                  className="paragraphCommon appBodyFontFamily  appBodyFontColor text-capitalize"
                  style={{ fontWeight: "400" }}
                >
                  Dear{" "}
                  {guestNickName ? guestNickName : this.props.guestAddressing},
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
            <div className="form-group">
              <button
                type="button"
                className="loginbtn  btn-def btn-block textboxTransparent"
                style={{ fontSize: "18px" }}
                onClick={() => {
                  browserHistory.push("/menus");
                }}
              >
                Next
              </button>
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
    guestId: getGuestId(state),
    eventName: getEventName(state),
    guestAddressing: getGuestAddressing(state),
    guestFirstName: getGuestFirstName(state),
    guestLastName: getGuestLastName(state)
  };
}
export default connect(mapStateToProps)(dashboard);
