import React, { Component } from 'react';
import firebase from 'firebase';
import { fetchGuests, fetchGuestChatList } from "../../api/chatApi";
import { getChatGuests, getEventId, getGuestId, getGuestFirstName, getGuestLastName, getChatMessages } from "../../selectors";
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

class ChatMessages extends Component {
  componentDidMount() {
    let { receiver } = this.props;
    let userKey = `chat.${receiver._id}`;
    let overallKey = 'overallChatCount';
    let overallCount = parseInt(localStorage.getItem(overallKey)) || 0;
    let chatCount = parseInt(localStorage.getItem(userKey)) || 0;
    let finalOverall = overallCount - chatCount;
    finalOverall = finalOverall > -1 ? finalOverall : 0;
    localStorage.setItem(overallKey, finalOverall);
    localStorage.setItem(userKey, 0);
  }

  render() {
    let { messages, requestSummary, receiverName, selectedGuestId, defaultGuestId, sender, submitMessageMobile, sendMobileRequest, submitReqReply, receiver } = this.props;
    let chatMessages = messages;
    let chatRequestSummary = requestSummary;
    let chatReceiverName = receiverName;
    let chatGuestId = selectedGuestId;
    let receiverId = defaultGuestId;
    let senderId = sender;
    let sendRequest = chatRequestSummary ? null : (
      <div className="chatsRoom">
        <div>
          <div className="chatReqMsg">
            {chatReceiverName} and you are not connected on chat
                  </div>
          <div data-sender={senderId} data-receiver={receiverId} className="commonBtnDestination mobileChatRequest" onClick={(e) => sendMobileRequest(e, chatGuestId, sender)}>Send Chat Request</div>
        </div>

      </div>
    )
    return (
      <div className="appGradientColor chatMobileBox">
        <div className="row receiverDiv">
          <div className="receiverName">{chatReceiverName && chatReceiverName}
          </div>
        </div>
        {sendRequest}
        {chatRequestSummary && chatRequestSummary.length > 0 &&
          chatRequestSummary.map(summary => {
            if (summary.status == "accepted") {
              return (
                <div className="chat-msg">
                  <div className="chatsRoom">
                    {chatMessages && chatMessages.length == 0 &&
                      <div className="chatReqMsg">{chatReceiverName} has accepted your chat request. Say Hi!</div>
                    }
                    {chatMessages && chatMessages.length > 0 && chatMessages.map(message => {
                      if (message.receiverId === senderId) {
                        return (
                          <div className="chatMessageBox"><div className="leftChat">{message.message}</div></div>);
                      }
                      else if (message.receiverId === chatGuestId) {
                        return (
                          <div className="chatMessageBox rightBox"><div className="rightChat">{message.message}</div></div>);
                      }
                    })
                    }
                  </div>
                  <form className="send-chat-msg" onSubmit={(e) => submitMessageMobile(e, receiver)}>
                    <div>
                      <input type="text" name="msgg" id="" className="loginText" />
                      <i className="icon-send-button send-msg" onClick={(e) => submitMessageMobile(e, receiver)}></i>
                    </div>
                  </form>
                </div>
              );
            }
            else if (summary.status == "asked") {
              if (summary.senderId === receiverId) {
                return (

                  <div className="chatsRoom">
                    <div className="chatRequest" id="chatRequestId">
                      <div className="">
                        Has sent you a chat request. Click Accept to chat.
                    </div>
                      <div className="">
                        <div className="commonBtnDestination" data-val="accepted" id={summary._id} onClick={(e) => submitReqReply(e, summary._id, true)}>Accept</div>
                        <div className="commonBtnDestination" data-val="ignored" id={summary._id} onClick={(e) => submitReqReply(e, summary._id, false)}>Ignore</div>
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
          })

        }
      </div>);
  }
}

export default ChatMessages;
