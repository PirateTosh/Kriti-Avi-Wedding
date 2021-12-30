import React from "react";
import "./menu.css";
import {
	getEventName,
	getGuestId,
	getEventId,
	getWelcomeDetails,
} from "../../selectors";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import { connect } from "react-redux";
import { fetchGuestInformation } from "../../api/guestInformationApi";
import { fetchEventDetails } from "../../api/eventDetailsApi";
import { checkIsUserLoggedIn } from "../../api/storageAPI";
import { browserHistory } from "react-router";
import { fetchAppDetails } from "../../api/appDetApi";
import { getAppDetails } from "../../selectors";
import "../../config/config.js";
import $ from "jquery";
import { isMobile, AppTItle, AppShortName } from "../../config/config.js";
import cloneDeep from "lodash/cloneDeep";
import _ from "lodash";
 import testimage from "../../../src/image/appLogo.png";

import { PHOTOS, DOWNLOADS } from "../../constants";

class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			welcomeData: cloneDeep(props.welcomeData),
			appDetails: cloneDeep(props.appDetails),
			showIosPWABanner: false,
			showAndroidPWADownload: false,
			downloadAndroidPWA: false,
		};
		if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
			browserHistory.push("/");
		}

		this.sessionGuestId = localStorage.getItem("guestId");
		this.eventName = localStorage.getItem("eventName");
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
			// setTimeout(() => window.location.reload(true), 30000)
		}
	}

	componentDidMount() {
		if (isMobile) {
			$("#spanHeaderText").html(AppShortName);
			$(".notificationBell").show();
			$(".chat").show();
			$(".appLogo").show();
			$("#homeLogo").hide();
			$("#homeLogoMob").show();
			$("#tag").hide();
			$("#tagMob").show();
		}
		
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

	hideBanner(e) {
		e.preventDefault();
		this.setState({ showIosPWABanner: false });
	}

	// downloadAndroid (e) {
	//   e.preventDefault();
	//   this.setState({ downloadAndroidPWA: true });
	// }

	componentWillReceiveProps(nextProps) {
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

	openEventDetails(event) {
		event.preventDefault();
		if (this.props.guestId || this.sessionGuestId) {
			fetchEventDetails(this.props.guestId || this.sessionGuestId);
		}
	}

	openGuestInformation(event) {
		event.preventDefault();
		if (this.props.guestId || this.sessionGuestId) {
			fetchGuestInformation(this.props.guestId || this.sessionGuestId);
		}
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
		$("body").css("background-image", "");
		$("body").attr("class", "appBody");
		$(".backIcon").hide();
		$(".backIconMobile").hide();
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
			<div className="categories">
								<img id="homeLogo" src={testimage} alt="" style={{width:"130px", height:"130px", marginTop:"10%"}}/>
								<img id="homeLogoMob" src={testimage} alt="" style={{ display:"none",width:"95px", height:"95px", marginTop:"24%", marginBottom:"2%"}}/>

								<h2 id="tag" style={{display: "block", color:"#781800ff", fontSize:"15px", marginTop:"1%",marginBottom:"-19%",fontFamily:"Scope one regular",fontWeight:"bold"}}>#KASealedTheDeal</h2>
								<h2 id="tagMob" style={{display: "none", color:"#781800ff", fontSize:"15px", marginBottom:"-40%",fontFamily:"Scope one regular",fontWeight:"bold"}}>#KASealedTheDeal</h2>
				<h3 className="coupleName appBodyFontColor appNavbarFontFamily headingTop headingTopSize">
					{/* {AppTItle} */}
					&nbsp;
				</h3>
				<div id="menuGrid" className="container categoriesItem" /*style={{marginTop:"-17%"}}*/>
					<ul id="iconContainer" className="category-items">
						<li className="appSelectColor">
							{appdet &&
								appdet.basicDetails &&
								appdet.basicDetails.eventType === "wedding" && (
									<div
										className="icon-namaste bigIcon  icon-white"
										style={{ backgroundColor: "#d4af37", height:"60px",width:"60px", height:"60px",width:"60px" }}
										onClick={() => {
											browserHistory.push("/welcome");
										}}
									/>
								)}
							{appdet &&
								appdet.basicDetails &&
								appdet.basicDetails.eventType !== "wedding" && (
									<div
										className="icon-handshake bigIcon  icon-white"
										style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
										onClick={() => {
											browserHistory.push("/welcome");
										}}
									/>
								)}
							<p className="iconName appBodyFontFamily appBodyFontColor">
								WELCOME
							</p>
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
													<div>
														<div
															className="icon-bride-and-groom bigIcon  icon-white"
															style={{ backgroundColor: "#d4af37", height:"60px",width:"60px"} }
															onClick={() => {
																browserHistory.push("/about2");
															}}
														/>
														<p className="iconName appBodyFontFamily appBodyFontColor">
															Krati & Avi
														</p>
													</div>
												)}
											{appdet &&
												appdet.basicDetails &&
												appdet.basicDetails.eventType !== "wedding" && (
													<div>
														<div
															className="icon-manager bigIcon icon-white"
															style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
															onClick={() => {
																browserHistory.push("/about2");
															}}
														/>
														<p className="iconName appBodyFontFamily appBodyFontColor">
															ABOUT
														</p>
													</div>
												)}
										</li>
									);
								}
							})}
						{this.hasFeature("Destination") ? (
							<li>
								<div
									className="icon-destination bigIcon  icon-white"
									style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
									onClick={() => {
										browserHistory.push("/destination");
									}}
								/>
								<p className="iconName appBodyFontFamily appBodyFontColor">
									DUBAI
								</p>
							</li>
						) : null}

						{/* My Purchases section - START */}
						{/* <li>
              <div
                className="fa fa-shopping-cart bigIcon  icon-white"
                onClick={() => {
                  browserHistory.push("/myPurchases");
                }}
              />
              <p className="iconName appBodyFontFamily appBodyFontColor">
                SPL Packages
              </p>
            </li> */}
						{/* My Purchases section - END */}

						{this.hasFeature("RSVP") ? (
							<li>
								<div
									className="icon-rsvp-and-registration bigIcon icon-white"
									style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
									onClick={() => {
										browserHistory.push("/rsvp");
									}}
								/>
								<p className="iconName appBodyFontFamily appBodyFontColor">
									{rsvp_name}
								</p>
							</li>
						) : null}

						{this.hasFeature("Speakers") ? (
							<li>
								<div
									className="fa fa-hotel bigIcon icon-white"
									style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
									onClick={() => {
										browserHistory.push("/speakers");
									}}
								/>
								<p className="iconName appBodyFontFamily appBodyFontColor">
									HOTELS
								</p>
							</li>
						) : null}
						

						<li>
							<div
								className="icon-event-details bigIcon  icon-white"
								style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
								onClick={() => {
									browserHistory.push("/eventDetails");
								}}
							/>
							<p className="iconName appBodyFontFamily appBodyFontColor">
								EVENT DETAILS
							</p>
						</li>
						{this.hasFeature("Itinerary") ? (
							<li>
								<div
									className="icon-itinerary bigIcon  icon-white"
									style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
									onClick={() => {
										browserHistory.push("/itinerary");
									}}
								/>
								<p className="iconName appBodyFontFamily appBodyFontColor">
									ITINERARY
								</p>
							</li>
						) : null}

						{this.hasFeature("Sponsors") ? (
							<li>
								<div
									className="fa fa-star bigIcon icon-white"
									style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
									onClick={() => {
										browserHistory.push("/sponsors");
									}}
								/>
								<p className="iconName appBodyFontFamily appBodyFontColor">
									SPONSORS
								</p>
							</li>
						) : null}
						{appdet &&
							appdet.appDetails &&
							appdet.appDetails.selectedAppGuestInfo && (
								<li>
									<div
										className="icon-my-info bigIcon icon-white"
										style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
										onClick={() => {
											browserHistory.push("/myInformation");
										}}
									/>
									<p className="iconName appBodyFontFamily appBodyFontColor">
										MY INFORMATION
									</p>
								</li>
							)}

						{/* COVID-INFO */}
						<li>
							<div
								className="fa fa-heartbeat bigIcon icon-white"
								style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
								onClick={() => {
									browserHistory.push("/covid-info");
								}}
							/>
							<p className="iconName appBodyFontFamily appBodyFontColor">
								COVID-19
							</p>
						</li>
						{/* {appdet &&
              appdet.appDetails &&
              appdet.appDetails.selectedAppDetails &&
              appdet.appDetails.selectedAppDetails.map((list) => {
                if (list === "Travel Details") {
                  return (
                    <li>
                      <div
                        className="fa fa-heartbeat bigIcon icon-white"
                        style={{ backgroundColor: "#781800ff" }}
                        onClick={() => {
                          browserHistory.push("/travel/booked-ticket");
                        }}
                      />
                      <p className="iconName appBodyFontFamily appBodyFontColor">
                        COVID-19
                      </p>
                    </li>
                  );
                }
              })} */}
						{this.preferenceExist() ? (
							<li>
								<div
									className="icon-my-preferences bigIcon icon-white"
									style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
									onClick={() => {
										browserHistory.push("/myPreferences");
									}}
								/>
								<p className="iconName appBodyFontFamily appBodyFontColor">
									MY PREFERENCES
								</p>
							</li>
						) : null}
						<li>
							<div
								className="icon-my-summary bigIcon icon-white"
								style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
								onClick={() => {
									browserHistory.push("/mySummary");
								}}
							/>
							<p className="iconName appBodyFontFamily appBodyFontColor">
								MY SUMMARY
							</p>
						</li>

						{this.hasFeature("photoShare") ? (
							<li>
								<div
									className="fa fa-camera bigIcon  icon-white"
									style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
									onClick={() => {
										browserHistory.push(`/${PHOTOS.BASE_PATH}`);
									}}
								/>
								<p className="iconName appBodyFontFamily appBodyFontColor">
									PHOTO SHARING
								</p>
							</li>
						) : null}

						{this.hasFeature("downloads") ? (
							<li>
								<div
									className="fa fa-download bigIcon  icon-white"
									style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
									onClick={() => {
										browserHistory.push(`/${DOWNLOADS.BASE_PATH}`);
									}}
								/>
								<p className="iconName appBodyFontFamily appBodyFontColor">
									E-DOCS
								</p>
							</li>
						) : null}

						{appdet &&
							appdet.appDetails &&
							appdet.appDetails.featureFeedbackType !== "none" && (
								<React.Fragment>
									{feedback ? (
										<li>
											<div
												className="icon-wishes bigIcon icon-white"
												style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
												onClick={() => {
													browserHistory.push("/feedback");
												}}
											/>
											<p className="iconName appBodyFontFamily appBodyFontColor">
												FEEDBACK
											</p>
										</li>
									) : (
										<li>
											<div
												className="icon-wishes bigIcon icon-white"
												style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
												onClick={() => {
													browserHistory.push("/wishes");
												}}
											/>
											<p className="iconName appBodyFontFamily appBodyFontColor">
												BLESSINGS
											</p>
										</li>
									)}
								</React.Fragment>
							)}

						{welcomeData &&
							((welcomeData.facebookLink &&
								typeof welcomeData.facebookLink !== "undefined") ||
								(welcomeData.twitterLink &&
									typeof welcomeData.twitterLink !== "undefined") ||
								(welcomeData.instagramLink &&
									typeof welcomeData.instagramLink !== "undefined")) && (
								<li>
									<div
										className="fa fa-share-square bigIcon icon-white"
										style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
										onClick={() => {
											browserHistory.push("/social");
										}}
									/>
									<p className="iconName appBodyFontFamily appBodyFontColor">
										SOCIAL
									</p>
								</li>
							)}
						{appdet &&
							appdet.appDetails &&
							appdet.appDetails.selectedAppDetails &&
							appdet.appDetails.selectedAppDetails.map((list) => {
								if (list === "Contact Details") {
									return (
										<li>
											<div
												className="icon-contact-us bigIcon icon-white"
												style={{ backgroundColor: "#d4af37", height:"60px",width:"60px" }}
												onClick={() => {
													browserHistory.push("/contactUs");
												}}
											/>
											<p className="iconName appBodyFontFamily appBodyFontColor">
												CONTACT US
											</p>
										</li>
									);
								}
							})}
					</ul>
				</div>
				{this.state.showIosPWABanner ? (
					<div
						className="download-app-banner-ios"
						onClick={this.hideBanner.bind(this)}
					>
						Click <img src="icons/ios-download.png" /> and{" "}
						<img src="icons/ios-add-new.png" /> Add to Homescreen to download
						app.
					</div>
				) : (
					""
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		eventName: getEventName(state),
		eventId: getEventId(state),
		guestId: getGuestId(state),
		appDetails: getAppDetails(state),
		welcomeData: getWelcomeDetails(state),
	};
}

export default connect(mapStateToProps)(Menu);
