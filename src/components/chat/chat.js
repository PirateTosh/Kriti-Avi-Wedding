import React, { Component } from 'react';
import firebase from 'firebase';
import { fetchGuests, fetchGuestChatList, reloadCurrentChat, getGuestList, sendRequest, sendMessage, loadOverallList, setRequest } from "../../api/chatApi";
import { setCurrentChat } from '../../actions/chat.action.js';
import { getChatGuests, getEventId, getGuestId, getGuestFirstName, getGuestLastName, getChatMessages } from "../../selectors";
import ChatNotificationCounter from '../notificationCounter/chatNotificationCounter.js';
import { checkIsUserLoggedIn } from '../../api/storageAPI';
import { browserHistory } from "react-router";
import cloneDeep from "lodash/cloneDeep";
import '../../config/config.js';
import '../../config/config.css';
import '../common.css';
import './chat.css';
import $ from 'jquery';
import { connect } from "react-redux";
import ReactDOM from 'react-dom';
import Meteor from "react-web-meteor";
import get from "lodash/get";
import set from "lodash/set";
import moment from "moment";
import { isMobile, AppTItle, AppShortName } from '../../config/config.js';
import _ from 'lodash';
import ChatMessages from "./chatMessages";

class Chat extends Component {

  constructor(props) {
    super(props);
    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
      browserHistory.push("/");
    }
    this.state = {
      showChatMessages: false,
      defaultGuestId: "",
      receiverName: "",
      chatSummaryData: "",
      chatRequestSummary: "",
      chatInformation: "",
      chatGuests: cloneDeep(props.chatGuests),
      chatMessages: cloneDeep(props.chatMessages),
      chats: [],
      guestFirstName: "",
      lastTime: '',
      chatHistory: [],

      searchText: ''
    };
    this.sessionEventId = '';
    this.sessionGuestId = '';
    this.submitMessage = this.submitMessage.bind(this);
    this.submitMessageMobile = this.submitMessageMobile.bind(this);
  }

  componentDidMount() {
    this.sessionEventId = localStorage.getItem('eventId');
    this.sessionGuestId = localStorage.getItem('guestId');

    // console.log("FETCHING LATEST LSIT");
    this.props.getList();
    this.props.fetchOnlineList(this.props.guest, this.props.event);

    if (isMobile) {
      $("#spanHeaderText").html("CHAT");
      $(".appLogo").hide();
      $(".slick-track").addClass("owl-stage");
    }
  }

  submitMessageMobile(e, currentGuest) {
    e.preventDefault();
    let msg = $("input[name=msgg]").val();
    if (msg == "") return;

    let { guest, currentId, guestDetails } = this.props;
    let senderId = guest;
    let receiverId = currentId;

    let msgObj = {
      senderId,
      senderName: guestDetails.guestFirstName,
      receiverId: currentId,
      receiverName: currentGuest.guestFirstName,
      message: msg
    };
    this.props.sendMessage(msgObj);
    $("input[name=msgg]").val("");
    $(".chatsRoom").scrollTop(99999999999999999);
  }
  submitMessage(e, currentGuest) {
    e.preventDefault();
    let msg = $("input[name=msg]").val();
    if (msg == "") return;

    let { guest, currentId, guestDetails } = this.props;
    let senderId = guest;
    let receiverId = currentId;

    let msgObj = {
      senderId,
      senderName: guestDetails.guestFirstName,
      receiverId: currentId,
      receiverName: currentGuest.guestFirstName,
      message: msg
    };
    this.props.sendMessage(msgObj);
    $("input[name=msg]").val("");
    $(".chatsRoom").scrollTop(99999999999999999);
  }
  getGuestChatDetails(event, guestId) {
    this.props.setCurrent(guestId);
    if (this.state.showChatMessages === false) {
      $(".chatsRoom").scrollTop(99999999999999999);
      this.setState({ showChatMessages: true });
    }
  }
  getSearchedGuestList(event) {
    var senderId = localStorage.getItem('guestId');
    var eventId = localStorage.getItem('eventId');
    let val = event.target.value;

    this.setState({
      searchText: val
    });
  }
  sendRequest(currentGuestId) {
    sendRequest({ senderId: this.props.guest, receiverId: currentGuestId });
  }

  sendMobileRequest(event, currentGuestId, guestId) {
    sendRequest({ senderId: guestId, receiverId: currentGuestId });
  }
  getTime(chatTime, currentTime) {
    var diff = currentTime - chatTime;
    var seconds = Math.floor(diff / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    if (days != 0)
      return (days + " days");
    else if (hours != 0)
      return (+ hours % 24 + " hrs");
    else if (minutes != 0)
      return (+ minutes % 24 + " min");
    else if (seconds != 0)
      return (+ seconds % 24 + " sec");
  }
  submitReqReply(event, requestId, finalStatus) {
    let status = finalStatus ? "accepted" : "rejected";
    // console.log(requestId, finalStatus);
    setRequest({ requestId, status });
  }
  submitMail(event) {
    event.preventDefault();
    let email = get(event.target, "attributes['data-mail'].value");
    window.location = "mailto:" + email;
  }
  getUsers() {
    let gList = [];
    let { searchText } = this.state;
    let { guestList } = this.props;

    if (_.size(this.props.guestList) > 0) {
      let ourId = this.props.guest;
      gList = _.map(this.props.guestList, (g, key) => {
        return {
          guestFirstName: g.name,
          _id: key,
          msg: g.msg,
          time: g.time,
          hasChat: true
        };
      });
    }
    gList = _.unionBy(gList, this.props.onlineList, g => g._id);
    gList = gList.sort(function(a,b) {
      if(a.time && b.time) {
        return a.time - b.time;
      }
      else if(a.time){
        return 1;
      }
      else return -1;
    });
    gList.forEach(g => {
      if (!g.guestPersonalEmail) {
        let og = this.props.onlineList.find(h => h._id === g._id);
        g.guestPersonalEmail = og ? og.guestPersonalEmail : '';
      }
    });

    let list = null;
    if (searchText && searchText !== '') {
      let regex = new RegExp(`^${searchText}`, 'i');

      list = gList.filter(g => g.guestFirstName.match(regex, "i"));
    }
    else {
      list = gList;
    }

    let { currentId } = this.props;
    return list.map((guest, key) => {
      {
        let time = 0;
        let dateNow = new Date();
        var timeStamp = Math.floor(Date.now());
        return (
          <div>
            <ChatNotificationCounter senderId={guest._id} />
            <div className={` chatGuestNames ankur ${(guest._id === currentId) ? "chatGuestActive" : ""}`}>
              <div className="btn btn-default btn-responsive chatGuestHover" data-time={guest.time} data-val={guest._id} id={guest._id} data-fname={guest.guestFirstName} onClick={() => {
                this.props.setCurrent(guest._id);
              }}>
                {guest.guestFirstName} {guest.guestLastName}
              </div>
              <div onClick={(e) => this.submitMail(e)} data-mail={guest.guestPersonalEmail} className="emailAnchor"><div className="icon-email" ></div></div>
              <div>
              </div>
            </div>
          </div>
        );
      }
    });
  }

  getSummary(summary, currentGuest) {
    let { chat, guest } = this.props;
    if (summary.status == "accepted") {
      return (
        <div>
          <div className="chatsRoom" id="inner-chat-box">
            {chat && chat.length == 0 &&
              <div className="chatMessageBox rightBox"><div className="rightChat">{this.state.receiverName} has accepted your chat request. Say Hi!</div></div>
            }
            {chat && chat.length > 0 &&
              chat.map(message => {
                if (message.senderId === currentGuest._id) {
                  return (
                    <div className="chatMessageBox"><div className="leftChat" key={message._id}>{message.message}</div></div>);
                }
                else {
                  return (
                    <div className="chatMessageBox rightBox"><div className="rightChat" key={message._id}>{message.message}</div></div>);
                }
              })
            }
          </div>
          <form className="input" onSubmit={(e) => this.submitMessage(e, currentGuest)}>
            <div className="form-group input-group">
              <input type="text" name="msg" className="chatInputBox loginText" />

              <i className="icon chat-send" onClick={(event) => {
                this.submitMessage(event, currentGuest);
              }}></i>
            </div>
          </form>
        </div>
      );
    }
    else if (summary.status == "asked") {
      if (summary.senderId !== guest) {
        return (

          <div className="chatsRoom">
            <div className="chatRequest" id="chatRequestId">
              <div className="">
                Has sent you a chat request. Click Accept to chat.
                </div>
              <div className="">
                <div className="commonBtnDestination" data-val="accepted" id={summary._id} onClick={(e) => this.submitReqReply(e, summary._id, true)}>Accept</div>
                <div className="commonBtnDestination" data-val="ignored" id={summary._id} onClick={(e) => this.submitReqReply(e, summary._id, false)}>Ignore</div>
              </div>
            </div>
          </div>
        );
      }
      else {
        return (
          <div className="chatsRoom"><div className="chatMessageBox rightBox"><div className="rightChat">Chat Request Was Sent</div></div></div>);
      }
    }
    else if (summary.status == "ignored") {
      return (
        <div className="chatsRoom"><div className="chatMessageBox rightBox"><div className="rightChat">Request Was Ignored</div></div></div>);
    }
  }

  getMobileGuestList() {
    let gList = [];
    let { searchText } = this.state;
    let { guestList } = this.props;

    if (_.size(this.props.guestList) > 0) {
      let ourId = this.props.guest;
      gList = _.map(this.props.guestList, (g, key) => {
        return {
          guestFirstName: g.name,
          _id: key,
          msg: g.msg,
          time: g.time,
          hasChat: true
        };
      });
    }
    gList = _.unionBy(gList, this.props.onlineList, g => g._id);
    gList.forEach(g => {
      if (!g.guestPersonalEmail) {
        let og = this.props.onlineList.find(h => h._id === g._id);
        g.guestPersonalEmail = og ? og.guestPersonalEmail : '';
      }
    });

    let list = null;
    if (searchText && searchText !== '') {
      let regex = new RegExp(`^${searchText}`, 'i');
      list = gList.filter(g => g.guestFirstName.match(regex, "i"));
    }
    else {
      list = _.sortBy(gList, 'time');
    }

    let { currentId } = this.props;
    return list &&
      list.map((guest, key) => {
        let time = 0;
        let dateNow = new Date();
        var timeStamp = Math.floor(Date.now());
        return (
          <div>
            <div className={` chatGuestNames mobileGuestNames ankur ${(guest._id === currentId) ? "chatGuestActive" : ""}`}>
              <ChatNotificationCounter senderId={guest._id} />
              <div className="btn btn-default btn-responsive chatGuestHover" data-time={guest.time} data-val={guest._id} id={guest._id} data-fname={guest.guestFirstName} onClick={(event) => {
                this.getGuestChatDetails(event, guest._id);
              }}>
                {guest.guestFirstName} {guest.guestLastName}
              </div>
              <div>
                {/* <div className="icon-chat"></div> */}
                <div className="emailAnchor">
                  <i className="icon-email" onClick={(e) => this.submitMail(e)} data-mail={guest.guestPersonalEmail} style={{ marginRight: '40px' }}></i>
                  <i className="icon-chat" onClick={(event) => { this.getGuestChatDetails(event, guest._id); }}></i>
                </div>
              </div>
              <div>

              </div>
            </div>

          </div>
        );
      });
  }

  componentDidUpdate() {
    if (this.state.showChatMessages) {
      // console.log("HELLO");
      $('#menuIcon').hide();
      $('.backIconMobile').hide();
      $(".chatsRoom").scrollTop(99999999999999999);
      $('#chatBackIcon').show();
      $('#chatBackIcon').click(function (e) {
        $('#chatBackIcon').hide();
        e.preventDefault();
        this.setState({
          showChatMessages: false,
        });
      }.bind(this));
    }
  }
  render() {
    const username = "Kevin Hsu";
    $('.backIcon').show();
    $('.backIconMobile').show();
    const { chatGuests } = this.state;

    let { guest, onlineList, requests, currentId, chat } = this.props;
    let currentGuest = onlineList.find(g => g._id === currentId);
    currentGuest = currentGuest ? currentGuest : onlineList.length > 0 ? onlineList[0] : {};

    if (!this.state.showChatMessages) {
      let userKey = `chat.${currentId}`;
      let overallKey = 'overallChatCount';
      let overallCount = parseInt(localStorage.getItem(overallKey)) || 0;
      let chatCount = parseInt(localStorage.getItem(userKey)) || 0;

      let finalOverall = overallCount - chatCount;
      finalOverall = finalOverall > -1 ? finalOverall : 0;
      localStorage.setItem(overallKey, finalOverall);
      localStorage.setItem(userKey, 0);
    }

    const currentGuestName = currentGuest.guestFirstName;
    let summary = requests && requests.find(r => r.senderId === currentId || r.receiverId === currentId);

    // console.log("ASFNASFNASF PASF")
    // console.log(summary);
    let noChat = this.props.chat.length < 1 && !summary;

    const summaryArray = summary ? [summary] : null;

    //console.log('chat guests', chatGuests);
    const { chats } = this.state;
    const chatGuestId = this.state.defaultGuestId;
    const chatReceiverName = currentGuestName;
    const chatMessages = this.state.chatSummaryData;
    const chatRequestSummary = this.state.chatRequestSummary;
    const totalChats = this.state.chatMessages && this.state.chatMessages[0];
    const chatSenderId = this.state.senderId;
    return (
      <div className="container resposiveHideHeading">
        <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block">CHAT</h3>
        <div className="row d-none d-sm-block d-sm-block-flex" >
          <div className="row chatBox">
            <div className="col-md-4 col-sm-12 col-xs-12 chatGuestList appNavbarBGColor">
              <div className="row">
                <input type="text" placeholder="SEARCH" className="searchBox" ref="searchName" onChange={(e) => this.getSearchedGuestList(e)} />
              </div>
              {this.getUsers()}
            </div>
            <div className="col-md-8 col-sm-12 col-xs-12 appGradientColor" style={{ minHeight: "350px" }}>
              <div className="row receiverDiv">

                <div className="receiverName">{chatReceiverName && chatReceiverName}
                </div>
              </div>
              {noChat &&
                <div className="chatsRoom">
                  <div><div className="chatMessageBox rightBox"><div className="rightChat">{this.state.receiverName} and you are not connected on chat<br />
                    <span onClick={(e) => sendRequest({
                      senderId: this.props.guest,
                      receiverId: currentGuest._id
                    })}>Send Chat Request</span></div></div></div>
                </div>
              }
              {summary && this.getSummary(summary, currentGuest)}
            </div>
          </div>
        </div>
        <div className="d-md-none d-lg-none d-xl-none">
          {!this.state.showChatMessages &&
            <div>
              <div className="row chatBox mobileChatBox">
                <div className="chatGuestList">
                  <div className="row">
                    <input type="text" placeholder="SEARCH" className="searchBox" ref="searchNameMobile" onChange={(e) => this.getSearchedGuestList(e)} />
                  </div>
                  <div>{this.getMobileGuestList()}</div>
                </div>
              </div></div>
          }

          {this.state.showChatMessages &&
            <div className="chat-inner" style={{ position: 'relative', top: '80px' }}>
              <ChatMessages messages={chat} requestSummary={summaryArray} receiver={currentGuest} receiverName={currentGuestName} selectedGuestId={currentId} defaultGuestId={currentId} sender={guest} submitMessageMobile={this.submitMessageMobile} sendMobileRequest={this.sendMobileRequest} submitReqReply={this.submitReqReply} />
            </div>
          }
        </div>

      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reloadChat: () => reloadCurrentChat(),
    getList: () => loadOverallList(),
    setCurrent: (id) => {
      dispatch(setCurrentChat(id));
      reloadCurrentChat();
    },
    fetchOnlineList: (guestId, eventId) => getGuestList({ guestId, eventId }),
    sendMessage: (msgObj) => sendMessage({ msgObj })
  }
};

const getChatList = (state) => {
  let list = state.myChatReducer.chatList;
  return list ? list : [];
}

const getOnlineList = (state) => {
  let list = state.myChatReducer.onlineList;
  return list ? list : [];
}

const getCurrent = (state) => {
  let currentId = state.myChatReducer.currentChatId;
  let list = state.myChatReducer.onlineList;
  let defaultUser = list && list.length > 0 ? list[0]._id : '';
  return currentId ? currentId : defaultUser;
};

const getCurrentChat = (state) => {
  let chat = state.myChatReducer.currentMessages;
  return chat ? chat : [];
};

const getCurrentRequests = (state) => {
  // console.log(state.myChatReducer.requests);
  let requests = state.myChatReducer.requests;
  return requests ? requests : [];
};

const getGuestDetails = () => {
  let data = localStorage.getItem("currentGuest");
  return data ? JSON.parse(data) : {};
};

function mapStateToProps(state) {
  return {
    chatGuests: getChatGuests(state),
    chatMessages: getChatMessages(state),
    eventId: getEventId(state),
    guestId: getGuestId(state),
    guestFname: getGuestFirstName(state),
    guestLname: getGuestLastName(state),

    guestDetails: getGuestDetails(),
    guestList: getChatList(state),
    onlineList: getOnlineList(state),
    currentId: getCurrent(state),
    searchList: [],
    guest: localStorage.getItem("guestId"),
    event: localStorage.getItem("eventId"),
    chat: getCurrentChat(state),
    requests: getCurrentRequests(state),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Chat);