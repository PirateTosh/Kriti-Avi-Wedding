import React from "react";
import { Route } from "react-router-dom";
import LoginPage from "./components/loginScreen/LoginScreen";
import Dashboard from "./components/dashboard/dashboard";
import Welcome from "./components/welcome/welcome";
import BrideAndGroom from "./components/brideAndGroom/brideAndGroom";
import Destination from "./components/destination/destination";
import Menus from "./components/menuScreen/menu";
import RSVP from "./components/rsvp/rsvp";
import MyInformation from "./components/myInformation/myInformation";
import TravelDetails from "./components/travelDetails/travelDetails";
import searchFlight from "./components/travelDetails/searchFlight";
import bookedTicket from "./components/travelDetails/bookedTicket";
import bookTicket from "./components/travelDetails/bookTicket";
import Itinerary from "./components/itinerary/itinerary";
import EventDetails from "./components/eventDetails/eventDetails";
import MyPreferences from "./components/myPreferences/myPreferences";
import MYSUMMARY from "./components/mySummary/mySummary";
import ContactUs from "./components/contactUs/contactUs";
import Wishes from "./components/wishes/wishes";
import Legal from "./components/legal/legal";
import privacyPolicy from "./components/legal/privacyPolicy";
import userAgreement from "./components/legal/userAgreement";
import legalTerms from "./components/legal/legalTerms";
import Social from "./components/social/social";
import Notifications from "./components/notifications/notifications";
import app from "./components/app";
import Chat from "./components/chat/chat";
import App from "./App";

import { DOWNLOADS, PHOTOS } from "./constants";

// New UI
import NewApp from "./newApp";
import MenuScreen from "./pages/menuScreen/menuScreen";

import aboutPage from "./pages/about/about";
import homePage from "./pages/home/home";
import speakerPage from "./pages/speakers/speaker";
import sponsorPage from "./pages/sponsors/sponsors";
import PhotoShare from "./pages/photoShare";
import PhotoLanding from "./pages/photoShare/templates/PhotoLanding";
import Groups from "./pages/photoShare/templates/Groups";
import Downloads from "./pages/downloads";

import MyPurchases from './pages/myPurchases/myPurchases';
// import Cart from './pages/myPurchases/cart';
// import Checkout from './pages/myPurchases/checkout';

export default (
  <div>
    <Route component={App}>
      <Route path="/" component={LoginPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/menus" component={Menus} />
      <Route path="/brideAndGroom" component={BrideAndGroom} />
      <Route path="/about" component={BrideAndGroom} />
      <Route path="/destination" component={Destination} />
      <Route path="/rsvp" component={RSVP} />
      <Route path="/myInformation" component={MyInformation} />
      <Route path="/travel/upload-ticket" component={TravelDetails} />
      <Route path="/itinerary" component={Itinerary} />
      <Route path="/eventDetails" component={EventDetails} />
      <Route path="/myPreferences" component={MyPreferences} />
      <Route path="/mySummary" component={MYSUMMARY} />
      <Route path="/contactUs" component={ContactUs} />
      <Route path="/wishes" component={Wishes} />
      <Route path="/feedback" component={Wishes} />
      <Route path="/legal" component={Legal} />
      <Route path="/social" component={Social} />
      <Route path="/myPurchases" component={MyPurchases} />
      {/* <Route path="/myPurchases/cart" component={Cart} /> */}
      {/* <Route path="/myPurchases/checkout" component={Checkout} /> */}
      <Route path="/notifications" component={Notifications} />
      <Route path="/chat" component={Chat} />
      <Route path="/legal/privacy-policy" component={privacyPolicy} />
      <Route path="/legal/terms-of-service" component={legalTerms} />
      <Route path="/legal/user-agreement" component={userAgreement} />
      <Route path="/travel/flight-search" component={searchFlight} />
      <Route path="/travel/booked-ticket" component={bookedTicket} />
      <Route path="/travel/book-ticket" component={bookTicket} />
    </Route>

    {/* New App UI */}
    <Route component={NewApp}>
      <Route path="/new" component={LoginPage} />
      <Route path="/new/home" component={MenuScreen} />
      <Route path="/about2" component={aboutPage} />
      <Route path="/home" component={homePage} />
      <Route path="/speakers" component={speakerPage} />
      <Route path="/sponsors" component={sponsorPage} />
      <Route path={`/${PHOTOS.BASE_PATH}/${PHOTOS.MY_GROUPS}`} component={Groups} />
      <Route path={`/${PHOTOS.BASE_PATH}(/:subPath)`} component={PhotoShare} />
      <Route path={`/${PHOTOS.LANDING}/:photoId(/:subPath)(/:commentId)`} component={PhotoLanding} />
      <Route path={`/${DOWNLOADS.BASE_PATH}`} component={Downloads} />
    </Route>
  </div>
);
