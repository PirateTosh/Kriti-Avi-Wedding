import React, { Component } from 'react';
import './App.css';
import 'react-alice-carousel/lib/alice-carousel.css';
import 'react-star-rating/dist/css/react-star-rating.min.css';
import LeftNav from "./components/navigation/leftNav";
import {getMobileOperatingSystem} from "./selectors";
import Header from "./components/navigation/header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import firebase from 'firebase';
import {checkIsUserLoggedIn} from './api/storageAPI';
import { getGuestId, getEventId } from './selectors.js';
import { connect } from "react-redux";
import { subscribeToChat, unsubscribeToChat } from './api/chatApi.js';
import { EventId } from './config/config.js';
import styled from 'styled-components'

const PageContainer = styled.div`
  position : relative;
  padding-top : 60px;
`
const NavBar = styled.div`
  position : relative;
`

class NewApp extends Component {
  constructor(props){
    super(props);
    var config = {
      apiKey: "AIzaSyCO_j3MEzDTJOnrcZFfJgKLF3vugMZEq4Q",
      authDomain: "key-solution-199905.firebaseapp.com",
      databaseURL: "https://key-solution-199905.firebaseio.com",
      projectId: "key-solution-199905",
      storageBucket: "key-solution-199905.appspot.com",
      messagingSenderId: "397063118289"
    };
  }

  componentDidMount() {
    let guestId = localStorage.getItem('guestId');
    if(guestId) {
      subscribeToChat({
        eventId: EventId,
        guestId
      });
    }
  }

  componentWillUnmount() {
    unsubscribeToChat();
  }

  componentWillReceiveProps(nextProps) {
    let { guestId, eventId } = this.props;
    console.log(guestId, eventId);
    console.log(nextProps.eventId, nextProps.guestId);
    if(eventId !== nextProps.eventId || guestId !== nextProps.guestId) {
      subscribeToChat({ eventId: nextProps.eventId, guestId: nextProps.guestId });
    }
  }
  render() {
    let { guestId, eventId } = this.props;
    return(
      <div className="app-body">
        <NavBar>
          {(() => {
            if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
              return '';
            }
            else if (getMobileOperatingSystem()) {
              return (<Header/>);
            } else {
              return ( <LeftNav/>);
            }
          })()}
        </NavBar>
        <PageContainer>
          {this.props.children}
        </PageContainer>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return
}
export default NewApp;