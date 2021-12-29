import React from "react";
import "./leftNav.css";
import {
	getEventId,
	getEventName,
	getGuestId,
	getPopupdata,
	getWelcomeDetails,
} from "../../selectors";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import { connect } from "react-redux";
import { logout } from "../../actions/logOut.action";
import $ from "jquery";
import get from "lodash/get";
import { fetchEventDetails } from "../../api/eventDetailsApi";
import { fetchGuestInformation } from "../../api/guestInformationApi";
import { fetchAppDetails } from "../../api/appDetApi";
import { getAppDetails } from "../../selectors";
import { browserHistory } from "react-router";
import "../../config/config.js";
import Popup from "react-popup";
import { AppTItle, AppShortName } from "../../config/config";
import cloneDeep from "lodash/cloneDeep";
import { checkIsUserLoggedIn } from "../../api/storageAPI";
import NotificationCounter from "../notificationCounter/notificationCounter";
import OverallChatNotificationCounter from "../notificationCounter/overallChatCounter.js";
import _ from "lodash";

import { DOWNLOADS, PHOTOS } from "../../constants";

import InstallPrompt from "install-prompt-banner";
class leftNav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			display: "none",
			leftNav: "block",
			welcomeData: cloneDeep(props.welcomeData),
			appDetails: cloneDeep(props.appDetails),
		};
		if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
			browserHistory.push("/");
		}
	}
	componentDidMount() {
		this.installPromptBanner = new InstallPrompt();
		this.installPromptBanner.addCount();

		let pathName = window.location.pathname;

		if (!this.props.welcomeData) {
			fetchWelcomeDetails();
		}
		fetchAppDetails();
		if (pathName != "/menus")
			$('*[data-menu="' + pathName + '"]').addClass("selectedMenu");
	}

	hasFeature(featureName) {
		const { appDetails } = this.state;
		let data = this.state.appDetails;
		let list = data && data.appDetails && data.appDetails.selectedAppDetails;
		if (_.values(list).includes(featureName)) {
			return true;
		} else {
			return false;
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.cid !== this.props.cid) {
			this.installPromptBanner.addCount().checkPrompt();
		}
		if (
			this.props.popDetails &&
			this.props.popDetails.count !== nextProps.popDetails.count
		) {
			Popup.alert(nextProps.popDetails.data);
		}
		if (this.props.appDetails !== nextProps.appDetails) {
			let appDetails = cloneDeep(nextProps.appDetails);
			this.setState({ appDetails: appDetails });
		}
		if (!nextProps.welcomeData) {
			fetchWelcomeDetails();
		}
		if (this.props.welcomeData !== nextProps.welcomeData) {
			this.setState({ welcomeData: cloneDeep(nextProps.welcomeData) });
		}
	}
	expandMenus(event) {
		event.preventDefault();
		let iconClass = get(event.target, "attributes['id'].value");
		if (this.state.leftNav === "block") {
			$("#" + iconClass).removeClass(iconClass);
			$("#" + iconClass).addClass("close");
			this.setState({ display: "block" });
			this.setState({ leftNav: "none" });
		} else {
			$("#" + iconClass).removeClass("close");
			$("#" + iconClass).addClass(iconClass);
			this.setState({ leftNav: "block" });
			this.setState({ display: "none" });
		}
	}
	openLogoutScreen(event) {
		window.localStorage.setItem("isLoggedIn", false);
		event.preventDefault();
		logout(null);
		browserHistory.push("/");
	}
	openEventDetails(event) {
		event.preventDefault();
		if (this.props.guestId) {
			fetchEventDetails(this.props.guestId);
		}
	}

	openGuestInformation(event) {
		event.preventDefault();
		if (this.props.guestId) {
			fetchGuestInformation(this.props.guestId);
		}
	}

	selectedMenu(event) {
		let menuName = event.currentTarget.dataset.menu;
		browserHistory.push(menuName);
		$(".icon-div").removeClass("selectedMenu");
		$(".leftMenuExpanded > li").removeClass("selectedMenu");
		$('*[data-menu="' + menuName + '"]').addClass("selectedMenu");
	}

	preferenceExist() {
		let data = this.state.appDetails;
		let list =
			data && data.appDetails && data.appDetails.selectedAppPreferences;
		let service =
			data && data.featureDetails && data.featureDetails.selectedFeatures;
		if (
			_.values(list).includes("Size") ||
			_.values(list).includes("Special Assistance") ||
			_.values(service).includes("Services") ||
			_.values(list).includes("Meal")
		) {
			return true;
		}
	}

	render() {
		const { appDetails } = this.state;
		let appdet = this.state.appDetails;
		let welcomeData = this.state.welcomeData;
		let feedback = false;
		if (
			welcomeData &&
			welcomeData.showFeedback &&
			welcomeData.showFeedback === true
		) {
			feedback = true;
		}
		var rsvp_name = "RSVP";
		if (
			appDetails &&
			appDetails.featureDetails &&
			appDetails.featureDetails.featureRSVPOption &&
			appDetails.featureDetails.featureRSVPOption == "RSVP Registration"
		) {
			rsvp_name = "REGISTRATION";
		}
		return (
			<div className="navSection">
				<div className="header appNavbarBGColor">
					<div className="leftHeader">
						<div
							className=" icon menu openMenuIcon icon-white"
							id="menu"
							onClick={this.expandMenus.bind(this)}
						/>
						<div
							className=" icon backIcon icon-white"
							id="menuIcon"
							onClick={() => {
								browserHistory.goBack();
							}}
						>
							<span className="hide_back">Back</span>
						</div>
					</div>
					<h1 className="name">
						<span className="appLogo headerLogo" />
						<span
							style={{ padding: "10px" }}
							className="appNavbarFontFamily appNavbarFontColor"
						>
							{AppShortName}
						</span>
					</h1>
					<div className="rightHeader">
						<div
							className=" icon notificationBell rightHeaderIcon icon-white"
							id="menuIcon"
							onClick={() => {
								browserHistory.push("/notifications");
							}}
						>
							<NotificationCounter />
						</div>
						{appdet &&
							appdet.appDetails &&
							appdet.appDetails.selectedAppDetails &&
							appdet.appDetails.selectedAppDetails.map((list) => {
								if (list === "Chat Option") {
									return (
										<div
											className="icon-chat rightHeaderIcon icon-white"
											id="menuIcon"
											style={{ margin: "0px" }}
											onClick={() => {
												browserHistory.push("/chat");
											}}
										>
											<OverallChatNotificationCounter />
										</div>
									);
								}
							})}
					</div>
				</div>
				<div
					className="leftMenu appNavbarBGColor"
					style={{ display: this.state.leftNav }}
				>
					<div
						className="icon-div"
						onClick={this.selectedMenu.bind(this)}
						data-menu="/welcome"
						data-isexapaned="false"
					>
						<span className="icon-handshake commonIcon icon-white" />
					</div>
					{appdet &&
						appdet.appDetails &&
						appdet.appDetails.selectedAppDetails &&
						appdet.appDetails.selectedAppDetails.map((list) => {
							if (list === "About") {
								return (
									<div>
										{appdet &&
											appdet.basicDetails &&
											appdet.basicDetails.eventType === "wedding" && (
												<div
													className="icon-div"
													onClick={this.selectedMenu.bind(this)}
													data-menu="/about2"
													data-isexapaned="false"
												>
													<span className="icon-bride-and-groom commonIcon icon-white" />
												</div>
											)}
										{appdet &&
											appdet.basicDetails &&
											appdet.basicDetails.eventType !== "wedding" && (
												<div
													className="icon-div"
													onClick={this.selectedMenu.bind(this)}
													data-menu="/about2"
													data-isexapaned="false"
												>
													<span className="icon-manager commonIcon icon-white" />
												</div>
											)}
									</div>
								);
							}
						})}
					{appdet &&
						appdet.appDetails &&
						appdet.appDetails.selectedAppDetails &&
						appdet.appDetails.selectedAppDetails.map((list) => {
							if (list === "Destination") {
								return (
									<div
										className="icon-div"
										onClick={this.selectedMenu.bind(this)}
										data-menu="/destination"
									>
										<span className="icon-destination commonIcon icon-white" />
									</div>
								);
							}
							if (list === "RSVP") {
								return (
									<div
										className="icon-div"
										onClick={this.selectedMenu.bind(this)}
										data-menu="/rsvp"
									>
										<span className="icon-rsvp-and-registration commonIcon icon-white" />
									</div>
								);
							}
						})}
					{this.hasFeature("photoShare") ? (
						<div
							className="icon-div"
							onClick={this.selectedMenu.bind(this)}
							data-menu={`/${PHOTOS.BASE_PATH}`}
						>
							<span className="fa fa-camera commonIcon icon-white" />
						</div>
					) : null}

					{this.hasFeature("downloads") ? (
						<div
							className="icon-div"
							onClick={this.selectedMenu.bind(this)}
							data-menu={`/${DOWNLOADS.BASE_PATH}`}
						>
							<span className="fa fa-download commonIcon icon-white" />
						</div>
					) : null}

					<div
						className="icon-div"
						onClick={this.selectedMenu.bind(this)}
						data-menu="/myInformation"
					>
						<span className="icon-my-info commonIcon icon-white" />
					</div>
					{appdet &&
						appdet.appDetails &&
						appdet.appDetails.selectedAppDetails &&
						appdet.appDetails.selectedAppDetails.map((list) => {
							if (list === "Travel Details") {
								return (
									<div
										className="icon-div"
										onClick={this.selectedMenu.bind(this)}
										data-menu="/travel/booked-ticket"
									>
										<span className="icon-travel-details commonIcon icon-white" />
									</div>
								);
							}
							if (list === "Itinerary") {
								return (
									<div
										className="icon-div"
										onClick={this.selectedMenu.bind(this)}
										data-menu="/itinerary"
									>
										<span className="icon-itinerary commonIcon icon-white" />
									</div>
								);
							}
						})}
					<div
						className="icon-div"
						onClick={this.selectedMenu.bind(this)}
						data-menu="/eventDetails"
					>
						<span className="icon-event-details commonIcon icon-white" />
					</div>
					{this.preferenceExist() ? (
						<div
							className="icon-div"
							onClick={this.selectedMenu.bind(this)}
							data-menu="/myPreferences"
						>
							<span className="icon-my-preferences commonIcon icon-white" />
						</div>
					) : null}

					<div
						className="icon-div"
						onClick={this.selectedMenu.bind(this)}
						data-menu="/mySummary"
					>
						<span className="icon-my-summary commonIcon icon-white" />
					</div>

					{appdet &&
						appdet.appDetails &&
						appdet.appDetails.selectedAppDetails &&
						appdet.appDetails.selectedAppDetails.map((list) => {
							if (list === "Contact Details") {
								return (
									<div
										className="icon-div"
										onClick={this.selectedMenu.bind(this)}
										data-menu="/contactUs"
									>
										{" "}
										<span className="icon-contact-us commonIcon icon-white" />
									</div>
								);
							}
						})}
					{appdet &&
						appdet.appDetails &&
						appdet.appDetails.featureFeedbackType !== "none" && (
							<React.Fragment>
								{feedback ? (
									<div
										className="icon-div"
										onClick={this.selectedMenu.bind(this)}
										data-menu="/feedback"
									>
										<span className="icon-wishes commonIcon icon-white" />
									</div>
								) : (
									<div
										className="icon-div"
										onClick={this.selectedMenu.bind(this)}
										data-menu="/wishes"
									>
										<span className="icon-wishes commonIcon icon-white" />
									</div>
								)}
							</React.Fragment>
						)}
					<div
						className="icon-div"
						onClick={this.selectedMenu.bind(this)}
						data-menu="/legal"
					>
						<span className="icon-legal commonIcon icon-white" />
					</div>
					{welcomeData &&
						((welcomeData.facebookLink &&
							typeof welcomeData.facebookLink != "undefined") ||
							(welcomeData.twitterLink &&
								typeof welcomeData.twitterLink != "undefined") ||
							(welcomeData.instagramLink &&
								typeof welcomeData.instagramLink != "undefined")) && (
							<div
								className="icon-div"
								onClick={this.selectedMenu.bind(this)}
								data-menu="/social"
							>
								<span className="fa fa-share-square commonIcon icon-white" />
							</div>
						)}
					<div className="icon-div" onClick={this.openLogoutScreen}>
						<span className="icon-log-out commonIcon icon-white" />
					</div>
				</div>
				<ul
					className="leftMenuExpanded appNavbarBGColor"
					style={{ display: this.state.display }}
				>
					<li
						onClick={this.selectedMenu.bind(this)}
						data-menu="/welcome"
						data-isexapaned="true"
					>
						<div className="expMenudiv">
							<div className="icon-div" style={{ float: "left" }}>
								<span className="icon-handshake commonIcon icon-white iconp" />
							</div>
							<p className="menuName" style={{ float: "left" }}>
								WELCOME
							</p>
						</div>
					</li>
					{appdet &&
						appdet.appDetails &&
						appdet.appDetails.selectedAppDetails &&
						appdet.appDetails.selectedAppDetails.map((list) => {
							if (list === "About") {
								return (
									<li>
										{appdet &&
											appdet.basicDetails &&
											appdet.basicDetails.eventType === "wedding" && (
												<div
													onClick={this.selectedMenu.bind(this)}
													data-menu="/about2"
													data-isexapaned="true"
												>
													<div className="expMenudiv">
														<div className="icon-div" style={{ float: "left" }}>
															<span className="icon-bride-and-groom commonIcon icon-white iconp" />
														</div>
														<p className="menuName" style={{ float: "left" }}>
															KRATI & AVI
														</p>
													</div>
												</div>
											)}
										{appdet &&
											appdet.basicDetails &&
											appdet.basicDetails.eventType !== "wedding" && (
												<div
													onClick={this.selectedMenu.bind(this)}
													data-menu="/about2"
													data-isexapaned="true"
												>
													<div className="expMenudiv">
														<div className="icon-div" style={{ float: "left" }}>
															<span className="icon-manager commonIcon icon-white iconp" />
														</div>
														<p className="menuName" style={{ float: "left" }}>
															ABOUT
														</p>
													</div>
												</div>
											)}
									</li>
								);
							}
						})}
					{appdet &&
						appdet.appDetails &&
						appdet.appDetails.selectedAppDetails &&
						appdet.appDetails.selectedAppDetails.map((list) => {
							if (list === "Destination") {
								return (
									<li
										onClick={this.selectedMenu.bind(this)}
										data-menu="/destination"
									>
										<div className="expMenudiv">
											<div className="icon-div" style={{ float: "left" }}>
												<span className="icon-destination commonIcon icon-white iconp" />
											</div>
											<p className="menuName" style={{ float: "left" }}>
												DUBAI
											</p>
										</div>
									</li>
								);
							}

							if (list === "RSVP") {
								return (
									<li onClick={this.selectedMenu.bind(this)} data-menu="/rsvp">
										<div className="expMenudiv">
											<div className="icon-div" style={{ float: "left" }}>
												<span className="icon-rsvp-and-registration commonIcon icon-white iconp" />
											</div>
											<p className="menuName" style={{ float: "left" }}>
												{rsvp_name}
											</p>
										</div>
									</li>
								);
							}
						})}
					{appdet &&
						appdet.appDetails &&
						appdet.appDetails.selectedAppDetails &&
						appdet.appDetails.selectedAppDetails.map((list) => {
							if (list === "Itinerary") {
								return (
									<li
										onClick={this.selectedMenu.bind(this)}
										data-menu="/itinerary"
									>
										<div className="expMenudiv">
											<div className="icon-div" style={{ float: "left" }}>
												<span className="icon-itinerary commonIcon icon-white iconp" />
											</div>
											<p className="menuName" style={{ float: "left" }}>
												ITINERARY
											</p>
										</div>
									</li>
								);
							}
						})}
					<li onClick={this.selectedMenu.bind(this)} data-menu="/eventDetails">
						<div className="expMenudiv">
							<div className="icon-div" style={{ float: "left" }}>
								<span className="icon-event-details commonIcon icon-white iconp" />
							</div>
							<p className="menuName" style={{ float: "left" }}>
								EVENT DETAILS
							</p>
						</div>
					</li>

					{appdet &&
						appdet.appDetails &&
						appdet.appDetails.selectedAppGuestInfo && (
							<li
								onClick={this.selectedMenu.bind(this)}
								data-menu="/myInformation"
							>
								<div className="expMenudiv">
									<div className="icon-div" style={{ float: "left" }}>
										<span className="icon-my-info commonIcon icon-white iconp" />
									</div>
									<p className="menuName" style={{ float: "left" }}>
										MY INFORMATION
									</p>
								</div>
							</li>
						)}
					{appdet &&
						appdet.appDetails &&
						appdet.appDetails.selectedAppDetails &&
						appdet.appDetails.selectedAppDetails.map((list) => {
							if (list === "Travel Details") {
								return (
									<li
										onClick={this.selectedMenu.bind(this)}
										data-menu="/travel/booked-ticket"
									>
										<div className="expMenudiv">
											<div className="icon-div" style={{ float: "left" }}>
												<span className="icon-travel-details commonIcon icon-white iconp" />
											</div>
											<p className="menuName" style={{ float: "left" }}>
												COVID-19
											</p>
										</div>
									</li>
								);
							}
						})}

					{this.preferenceExist() ? (
						<li
							onClick={this.selectedMenu.bind(this)}
							data-menu="/myPreferences"
						>
							<div className="expMenudiv">
								<div className="icon-div" style={{ float: "left" }}>
									<span className="icon-my-preferences commonIcon icon-white iconp" />
								</div>
								<p className="menuName" style={{ float: "left" }}>
									MY PREFERENCES
								</p>
							</div>
						</li>
					) : null}

					<li onClick={this.selectedMenu.bind(this)} data-menu="/mySummary">
						<div className="expMenudiv">
							<div className="icon-div" style={{ float: "left" }}>
								<span className="icon-my-summary commonIcon icon-white iconp" />
							</div>
							<p className="menuName" style={{ float: "left" }}>
								MY SUMMARY
							</p>
						</div>
					</li>

					{this.hasFeature("photoShare") ? (
						<li
							onClick={this.selectedMenu.bind(this)}
							data-menu={`/${PHOTOS.BASE_PATH}`}
						>
							<div className="expMenudiv">
								<div className="icon-div" style={{ float: "left" }}>
									<span className="fa fa-camera commonIcon icon-white iconp" />
								</div>
								<p className="menuName" style={{ float: "left" }}>
									PHOTO SHARE
								</p>
							</div>
						</li>
					) : null}

					{this.hasFeature("downloads") ? (
						<li
							onClick={this.selectedMenu.bind(this)}
							data-menu={`/${DOWNLOADS.BASE_PATH}`}
						>
							<div className="expMenudiv">
								<div className="icon-div" style={{ float: "left" }}>
									<span className="fa fa-download commonIcon icon-white iconp" />
								</div>
								<p className="menuName" style={{ float: "left" }}>
									E-DOCS
								</p>
							</div>
						</li>
					) : null}

					{appdet &&
						appdet.appDetails &&
						appdet.appDetails.featureFeedbackType !== "none" && (
							<React.Fragment>
								{feedback ? (
									<li
										onClick={this.selectedMenu.bind(this)}
										data-menu="/feedback"
									>
										<div className="expMenudiv">
											<div className="icon-div" style={{ float: "left" }}>
												<span className="icon-wishes commonIcon icon-white iconp" />
											</div>
											<p className="menuName" style={{ float: "left" }}>
												FEEDBACK
											</p>
										</div>
									</li>
								) : (
									<li
										onClick={this.selectedMenu.bind(this)}
										data-menu="/wishes"
									>
										<div className="expMenudiv">
											<div className="icon-div" style={{ float: "left" }}>
												<span className="icon-wishes commonIcon icon-white iconp" />
											</div>
											<p className="menuName" style={{ float: "left" }}>
												BLESSINGS
											</p>
										</div>
									</li>
								)}
							</React.Fragment>
						)}
					{welcomeData &&
						((welcomeData.facebookLink &&
							typeof welcomeData.facebookLink != "undefined") ||
							(welcomeData.twitterLink &&
								typeof welcomeData.twitterLink != "undefined") ||
							(welcomeData.instagramLink &&
								typeof welcomeData.instagramLink != "undefined")) && (
							<li onClick={this.selectedMenu.bind(this)} data-menu="/social">
								<div className="expMenudiv">
									<div className="icon-div" style={{ float: "left" }}>
										<span className="fa fa-share-square commonIcon icon-white iconp" />
									</div>
									<p className="menuName" style={{ float: "left" }}>
										SOCIAL
									</p>
								</div>
							</li>
						)}
					{appdet &&
						appdet.appDetails &&
						appdet.appDetails.selectedAppDetails &&
						appdet.appDetails.selectedAppDetails.map((list) => {
							if (list === "Contact Details") {
								return (
									<li
										onClick={this.selectedMenu.bind(this)}
										data-menu="/contactUs"
									>
										<div className="expMenudiv">
											<div className="icon-div" style={{ float: "left" }}>
												<span className="icon-contact-us commonIcon icon-white iconp" />
											</div>
											<p className="menuName" style={{ float: "left" }}>
												CONTACT US
											</p>
										</div>
									</li>
								);
							}
						})}

					<li onClick={this.selectedMenu.bind(this)} data-menu="/legal">
						<div className="expMenudiv">
							<div className="icon-div" style={{ float: "left" }}>
								<span className="icon-legal commonIcon icon-white iconp" />
							</div>
							<p className="menuName" style={{ float: "left" }}>
								LEGAL
							</p>
						</div>
					</li>

					<li onClick={this.openLogoutScreen}>
						<div className="expMenudiv">
							<div className="icon-div" style={{ float: "left" }}>
								<span className="icon-log-out commonIcon icon-white iconp" />
							</div>
							<p className="menuName" style={{ float: "left" }}>
								LOGOUT
							</p>
						</div>
					</li>
				</ul>
				<Popup />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		eventName: getEventName(state),
		eventId: getEventId(state),
		guestId: getGuestId(state),
		popDetails: getPopupdata(state),
		appDetails: getAppDetails(state),
		welcomeData: getWelcomeDetails(state),
	};
}
export default connect(mapStateToProps)(leftNav);
