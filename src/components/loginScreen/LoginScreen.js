import React from "react";
import "./login.css";
import "./../../lib/bootstrap-4.0.0-dist/css/bootstrap.min.css";
//import loginIcon from "../../assets/images/loginIcom.jpg";
import { fetchLoginDetails } from "../../api/loginApi";
import { fetchAppDetails } from "../../api/appDetApi";
import { getAppDetails } from "../../selectors";
import { connect } from "react-redux";
import "../../config/config.css";
import { AppTItle } from "../../config/config.js";
import { checkIsUserLoggedIn } from "../../api/storageAPI";
import { browserHistory } from "react-router";
import cloneDeep from "lodash/cloneDeep";
import Popup from "react-popup";
import $ from "jquery";

class login extends React.Component {
  constructor(props) {
    super(props);
    if (checkIsUserLoggedIn() == "true") {
      browserHistory.push("/menus");
    }
    this.state = {
      appDetails: cloneDeep(props.appDetails)
    };
  }

  componentDidMount() {
    fetchAppDetails();
    $("body").removeClass("appBody");
    $("body").addClass("login-page");
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.appDetails !== nextProps.appDetails) {
      let appDetails = cloneDeep(nextProps.appDetails);
      this.setState({ appDetails: appDetails });
    }
    $(".toggle-password").click(function() {
      $(this).toggleClass("fa-eye fa-eye-slash");
      var input = $($(this).attr("toggle"));
      input.toggleClass("password-mask");
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const email = this.refs.username.value.trim();
    const password = this.refs.password.value;
    fetchLoginDetails(email, password);
  }

  render() {
    let guestLoginEmail =
      undefined !== this.props.location.query.e
        ? this.props.location.query.e.replace("/", "")
        : null;
    let guestAccessCode =
      undefined !== this.props.location.query.p
        ? this.props.location.query.p
        : null;

    return (
      <div className="container">
        <Popup />
        <div className="Absolute-Center is-Responsive">
          <div className="appLogo logo" />
          <h1 className="nameHeading appBodyFontColor appBodyFontFamily">
            {AppTItle}
          </h1>
          <form id="loginForm">
            <div className="form-group input-group">
              <input
                autoFocus
                ref="username"
                className="textboxTransparent loginText"
                type="text"
                name="username"
                placeholder="Email ID"
                value={guestLoginEmail}
              />
            </div>
            <div className="form-group input-group">
              <input
                id="password-field"
                ref="password"
                className="textboxTransparent loginText password-mask"
                type="number"
                name="password"
                placeholder="Password"
                value={guestAccessCode}
              />
              <span
                toggle="#password-field"
                className="fa fa-fw fa-eye field-icon toggle-password"
              />
            </div>
            <div className="form-group">
              <button
                className="loginbtn  btn-def btn-block textboxTransparent"
                style={{ fontSize: "22px" }}
                onClick={this.handleSubmit.bind(this)}
              >
                SIGN IN
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appDetails: getAppDetails(state)
  };
}

export default connect(mapStateToProps)(login);
