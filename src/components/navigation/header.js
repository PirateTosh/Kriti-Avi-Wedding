import React from "react";
import "./leftNav.css";
import { getEventName, getWelcomeDetails, getPopupdata } from "../../selectors";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import { logout } from "../../actions/logOut.action";
import { fetchAppDetails } from "../../api/appDetApi";
import { getAppDetails } from "../../selectors";
import $ from "jquery";
import get from "lodash/get";
import { AppTItle, AppShortName } from "../../config/config";
import cloneDeep from "lodash/cloneDeep";
import Popup from "react-popup";
import { checkIsUserLoggedIn } from "../../api/storageAPI";
import NotificationCounter from "../notificationCounter/notificationCounter";
import OverallChatNotificationCounter from "../notificationCounter/overallChatCounter.js";
import _ from "lodash";
import { DOWNLOADS, PHOTOS } from "../../constants";

class header extends React.Component {
	iconClass = "";
	isLeftMenu = false;
	constructor(props) {
		super(props);
		this.state = {
			isMenuHidden: true,
			welcomeData: cloneDeep(props.welcomeData),
			appDetails: cloneDeep(props.appDetails),
			showAndroidPWADownload: false,
			showIosPWABanner: false,
			pwaInstruction: false,
			showPrompt: false,
			beforeinstallprompt: null,
		};
		if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
			browserHistory.push("/");
		}
	}

	openLogoutScreen(event) {
		window.localStorage.setItem("isLoggedIn", false);
		event.preventDefault();
		logout(null);
		browserHistory.push("/");
	}

	componentDidMount() {
		$(".pwa-popover").hide();
		fetchAppDetails();
		if (!this.props.welcomeData) {
			fetchWelcomeDetails();
		}
		if (window.matchMedia("(display-mode: standalone)").matches) {
			this.setState({
				showAndroidPWADownload: false,
				showIosPWABanner: false,
			});
		}
	}

	componentWillMount() {
		const isIos = () => {
			const userAgent = window.navigator.userAgent.toLowerCase();
			return /iphone|ipad|ipod/.test(userAgent);
		};
		// Detects if device is in standalone mode
		const isInStandaloneMode = () =>
			"standalone" in window.navigator && window.navigator.standalone;

		// Checks if should display install popup notification:
		if (isIos() && !isInStandaloneMode()) {
			this.setState({ showIosPWABanner: true });
		}

		const isAndroid = () => {
			const userAgent = window.navigator.userAgent.toLowerCase();
			return /android/.test(userAgent);
		};

		if (isAndroid() && !isInStandaloneMode()) {
			this.setState({ showAndroidPWADownload: true });
		}
	}

	togglePWAInstruction() {
		console.log("Clicked ...");
		this.setState({
			pwaInstruction: !this.state.pwaInstruction,
		});
	}

	closeInstruction(event) {
		event.preventDefault();
		$(".pwa-popover").hide();
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

	toggleHidden(event) {
		this.setState({
			isMenuHidden: !this.state.isMenuHidden,
		});
		this.iconClass = get(event.target, "attributes['id'].value");
		let isClose = $(event.currentTarget).hasClass("close");
		if (this.state.isMenuHidden) {
			$("#" + this.iconClass).removeClass(this.iconClass);
			$("#" + this.iconClass).addClass("close");
		} else {
			let menuName = event.currentTarget.dataset.menu;
			if (!isClose) {
				if (event && event.currentTarget) {
					browserHistory.push("/" + menuName);
				} else {
					browserHistory.push("/menus");
				}
			}
			$("#menuL").removeClass("close");
			$("#menuL").addClass("menu");
		}
	}

	handleBackButton(event) {
		event.preventDefault();
		console.log("CLicked Back Button", this);
		const path = window.location.pathname;
		switch (path) {
			case "/photos":
				browserHistory.push("/");
				break;
			case "/photos/guests":
				browserHistory.push("/");
				break;
			default:
				browserHistory.goBack();
		}
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
	handleDeferredPrompt = (e) => {
		const { showPrompt, beforeinstallprompt } = this.state;
		if (showPrompt) {
			// alert("Will show A2HS here");
			beforeinstallprompt.prompt();
			beforeinstallprompt.userChoice.then(function (choiceResult) {
				if (choiceResult.outcome === "accepted") {
					document.querySelector(".a2hsBtn").classList.add("hide");
				} else {
					console.log("User dismissed the A2sh prompt");
				}
			});
		} else {
			$(".pwa-popover").show();
		}
	};

	render() {
		const { appDetails } = this.state;
		let appdet = this.state.appDetails;
		let welcomeData = this.state.welcomeData;
		let feedback = false;
		let rsvp_name = "RSVP";
		if (
			appDetails &&
			appDetails.featureDetails &&
			appDetails.featureDetails.featureRSVPOption &&
			appDetails.featureDetails.featureRSVPOption == "RSVP Registration"
		) {
			rsvp_name = "REGISTRATION";
		}
		if (
			welcomeData &&
			welcomeData.showFeedback &&
			welcomeData.showFeedback === true
		) {
			feedback = true;
		}

		// NB - Add to HomeScreen
		window.addEventListener("beforeinstallprompt", (e) => {
			const showPrompt = true;
			this.setState({ showPrompt, beforeinstallprompt: e });
			console.log(
				"beforeinstallprompt has fired and the showpromp value is ",
				this.state.showPrompt
			);
		});
		// NB - Add to HomeScreen - END
		return (
			<div className="">
				<div className="pwa-popover" onClick={this.closeInstruction.bind(this)}>
					<div className="text-right">
						<img
							className="pwa-arrow"
							src="./icons/pwa-arrow.png"
							alt="settings arrow"
						/>
					</div>
					<div className="pwa-dark">
						<h4>Download the app</h4>
						Click <img className="install-img" src="icons/more.png" /> then{" "}
						<span className="a2hsSpan">"Add to Home Screen"</span> from browser
						menu.
						<button>GOT IT!</button>
					</div>
				</div>
				<div className="header appNavbarBGColor appNavbarFontFamily appNavbarFontColor">
					<div className="leftHeaderMobile">
						<div
							className="icon backIconMobile icon-white"
							id="menuIcon"
							onClick={this.handleBackButton.bind(this)}
						/>
						<div className="icon icon-white hidden" id="chatBackIcon">
							{" "}
						</div>
						<div
							className="icon menu openMenuIcon mobileHamBurgerIconL icon-white"
							id="menuL"
							onClick={this.toggleHidden.bind(this)}
						/>
						{/* <div className=" icon backIcon icon-white" id="menuIcon" onClick={() => { browserHistory.goBack() }} >
              <span className="hide_back">Back</span>
            </div> */}
					</div>
					<h1 className="name" style={{ width: "50%" }}>
						{/* <span className="appLogo" style={{width:'50px',height:'50px',float:'left',backgroundSize:'contain', position: "relative", bottom: "10px"}}></span> */}
						<span id="spanHeaderText" className="topHeaderCss">
							{AppShortName}
						</span>
					</h1>
					<div className="rightHeader">
						{this.state.showAndroidPWADownload ? (
							<div
								className="fa fa-plus-square rightHeaderIcon icon-white a2hsBtn"
								id="deferredPrompt"
								onClick={this.handleDeferredPrompt}
							/>
						) : (
							""
						)}
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
				{!this.state.isMenuHidden && (
					<ul
						id="mobileSideMenus"
						className="leftMenuExpanded appNavbarFontFamily appNavbarBGColor"
						style={{ display: this.state.display }}
					>
						<li onClick={this.toggleHidden.bind(this)} data-menu="welcome">
							<div className="expMenudiv">
								<div className="icon-div">
									<span className="icon-handshake commonIcon icon-white iconp" />
								</div>
								<p className="menuName">WELCOME</p>
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
														onClick={this.toggleHidden.bind(this)}
														data-menu="brideAndGroom"
													>
														<div className="expMenudiv">
															<div className="icon-div">
																<span className="icon-bride-and-groom commonIcon icon-white iconp" />
															</div>
															<p className="menuName">KRATI & AVI</p>
														</div>
													</div>
												)}
											{appdet &&
												appdet.basicDetails &&
												appdet.basicDetails.eventType !== "wedding" && (
													<div
														onClick={this.toggleHidden.bind(this)}
														data-menu="about"
													>
														<div className="expMenudiv">
															<div className="icon-div">
																<span className="icon-manager commonIcon icon-white iconp" />
															</div>
															<p className="menuName">ABOUT</p>
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
											onClick={this.toggleHidden.bind(this)}
											data-menu="destination"
										>
											<div className="expMenudiv">
												<div className="icon-div">
													<span className="icon-destination commonIcon icon-white iconp" />
												</div>
												<p className="menuName">DUBAI</p>
											</div>
										</li>
									);
								}
							})}

						{appdet &&
							appdet.appDetails &&
							appdet.appDetails.selectedAppDetails &&
							appdet.appDetails.selectedAppDetails.map((list) => {
								if (list === "RSVP") {
									return (
										<li onClick={this.toggleHidden.bind(this)} data-menu="rsvp">
											<div className="expMenudiv">
												<div className="icon-div">
													<span className="icon-rsvp-and-registration commonIcon icon-white iconp" />
												</div>
												<p className="menuName">{rsvp_name}</p>
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
											onClick={this.toggleHidden.bind(this)}
											data-menu="itinerary"
										>
											<div className="expMenudiv">
												<div className="icon-div">
													<span className="icon-itinerary commonIcon icon-white iconp" />
												</div>
												<p className="menuName">ITINERARY</p>
											</div>
										</li>
									);
								}
							})}

						<li onClick={this.toggleHidden.bind(this)} data-menu="eventDetails">
							<div className="expMenudiv">
								<div className="icon-div">
									<span className="icon-event-details commonIcon icon-white iconp" />
								</div>
								<p className="menuName">EVENT DETAILS</p>
							</div>
						</li>
						{appdet &&
							appdet.appDetails &&
							appdet.appDetails.selectedAppDetails &&
							appdet.appDetails.selectedAppDetails.map((list) => {
								if (list === "Speakers") {
									return (
										<li
											onClick={this.toggleHidden.bind(this)}
											data-menu="speakers"
										>
											<div className="expMenudiv">
												<div className="icon-div">
													<span className="fa fa-microphone commonIcon icon-white iconp-fa" />
												</div>
												<p className="menuName">HOTELS</p>
											</div>
										</li>
									);
								}
							})}

						<li
							onClick={this.toggleHidden.bind(this)}
							data-menu="myInformation"
						>
							<div className="expMenudiv">
								<div className="icon-div">
									<span className="icon-my-info commonIcon icon-white iconp" />
								</div>
								<p className="menuName">MY INFORMATION</p>
							</div>
						</li>
						{appdet &&
							appdet.appDetails &&
							appdet.appDetails.selectedAppDetails &&
							appdet.appDetails.selectedAppDetails.map((list) => {
								if (list === "Travel Details") {
									return (
										<li
											onClick={this.toggleHidden.bind(this)}
											data-menu="travel/booked-ticket"
										>
											<div className="expMenudiv">
												<div className="icon-div">
													<span className="icon-travel-details commonIcon icon-white iconp" />
												</div>
												<p className="menuName">TRAVEL DETAILS</p>
											</div>
										</li>
									);
								}

								if (list === "Sponsors") {
									return (
										<li
											onClick={this.toggleHidden.bind(this)}
											data-menu="Sponsors"
										>
											<div className="expMenudiv">
												<div className="icon-div">
													<span className="fa fa-star commonIcon icon-white iconp" />
												</div>
												<p className="menuName">SPONSORS</p>
											</div>
										</li>
									);
								}
							})}

						{this.preferenceExist() ? (
							<li
								onClick={this.toggleHidden.bind(this)}
								data-menu="myPreferences"
							>
								<div className="expMenudiv">
									<div className="icon-div">
										<span className="icon-my-preferences commonIcon icon-white iconp" />
									</div>
									<p className="menuName">MY PREFERENCES</p>
								</div>
							</li>
						) : null}

						<li onClick={this.toggleHidden.bind(this)} data-menu="mySummary">
							<div className="expMenudiv">
								<div className="icon-div">
									<span className="icon-my-summary commonIcon icon-white iconp" />
								</div>
								<p className="menuName">MY SUMMARY</p>
							</div>
						</li>

						{appdet &&
							appdet.appDetails &&
							appdet.appDetails.selectedAppDetails &&
							appdet.appDetails.selectedAppDetails.map((list) => {
								if (list === "photoShare") {
									return (
										<li
											onClick={this.toggleHidden.bind(this)}
											data-menu="photos"
										>
											<div className="expMenudiv">
												<div className="icon-div">
													<span className="fa fa-camera commonIcon icon-white iconp" />
												</div>
												<p className="menuName">PHOTO SHARING</p>
											</div>
										</li>
									);
								}
								console.log("LIST IS ", list);
								if (list === "downloads") {
									return (
										<li
											onClick={this.toggleHidden.bind(this)}
											data-menu="downloads"
										>
											<div className="expMenudiv">
												<div className="icon-div">
													<span className="fa fa-download commonIcon icon-white iconp" />
												</div>
												<p className="menuName">E-DOCS</p>
											</div>
										</li>
									);
								}
							})}

						{appdet &&
							appdet.appDetails &&
							appdet.appDetails.featureFeedbackType !== "none" && (
								<React.Fragment>
									{feedback ? (
										<li
											onClick={this.toggleHidden.bind(this)}
											data-menu="feedback"
										>
											<div className="expMenudiv">
												<div className="icon-div">
													<span className="icon-wishes commonIcon icon-white iconp" />
												</div>
												<p className="menuName">FEEDBACK</p>
											</div>
										</li>
									) : (
										<li
											onClick={this.toggleHidden.bind(this)}
											data-menu="wishes"
										>
											<div className="expMenudiv">
												<div className="icon-div">
													<span className="icon-wishes commonIcon icon-white iconp" />
												</div>
												<p className="menuName">BLESSINGS</p>
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
								<li onClick={this.toggleHidden.bind(this)} data-menu="social">
									<div className="expMenudiv">
										<div className="icon-div">
											<span className="fa fa-share-square commonIcon icon-white iconp" />
										</div>
										<p className="menuName">SOCIAL</p>
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
											onClick={this.toggleHidden.bind(this)}
											data-menu="contactUs"
										>
											<div className="expMenudiv">
												<div className="icon-div">
													<span className="icon-contact-us commonIcon icon-white iconp" />
												</div>
												<p className="menuName">CONTACT US</p>
											</div>
										</li>
									);
								}
							})}
						<li onClick={this.toggleHidden.bind(this)} data-menu="legal">
							<div className="expMenudiv">
								<div className="icon-div">
									<span className="icon-legal commonIcon icon-white iconp" />
								</div>
								<p className="menuName">LEGAL</p>
							</div>
						</li>
						<li onClick={this.openLogoutScreen}>
							<div className="expMenudiv">
								<div className="icon-div">
									<span className="icon-log-out commonIcon icon-white iconp" />
								</div>
								<p className="menuName">LOGOUT</p>
							</div>
						</li>
					</ul>
				)}
				<Popup />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		popDetails: getPopupdata(state),
		eventName: getEventName(state),
		appDetails: getAppDetails(state),
		welcomeData: getWelcomeDetails(state),
	};
}
export default connect(mapStateToProps)(header);
