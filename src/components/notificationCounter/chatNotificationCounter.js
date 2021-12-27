import React, { Component } from 'react';

class ChatNotificationCounter extends React.Component {

  state = {
    unreadCount: 0
  }

  componentDidMount() {
    let { senderId } = this.props;
    let userKey = `chat.${senderId}`;
    this.timer = setInterval(() => {
      let count = parseInt(localStorage.getItem(userKey)) || 0;
      let { unreadCount } = this.state;
      if(unreadCount !== count) {
        this.setState({
          unreadCount: count
        });
      }
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render(){
    let style = {
      box : {
        position: 'absolute',
        top: 0,
        right: '10px',
        height: '20px',
        width: '20px',
        borderRadius: '50%',
        background: 'red',
        fontSize: '12px',
        zIndex: 5,
        textAlign: 'center',
      }
    }
    let { unreadCount } = this.state;
    if(unreadCount > 0) {
      return(
        <div style={style.box}>
          {unreadCount}
        </div>
      )
    }
    else {
      return null;
    }

  }
}

export default ChatNotificationCounter;
