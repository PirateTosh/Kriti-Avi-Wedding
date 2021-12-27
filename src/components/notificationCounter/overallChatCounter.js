import React, { Component } from 'react';

class OverallChatNotificationCounter extends React.Component {

  state = {
    unreadCount: 0
  }

  componentDidMount() {
    let overallKey = 'overallChatCount';
    this.timer = setInterval(() => {
      let overallCount = parseInt(localStorage.getItem(overallKey)) || 0;
      let { unreadCount } = this.state;
      if(unreadCount !== overallCount) {
        this.setState({
          unreadCount: overallCount
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

export default OverallChatNotificationCounter;
