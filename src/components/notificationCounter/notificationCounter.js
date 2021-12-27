import React, { Component } from 'react';
import { connect } from "react-redux";

class NotificationCounter extends React.Component {
  render(){
    let style = {
      box : {
        position: 'absolute',
        top: 0,
        right: '-10px',
        height: '20px',
        width: '20px',
        borderRadius: '50%',
        background: 'red',
        fontSize: '12px',
      }
    }
    let { unreadCount } = this.props;
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

const mapStateToProps = (state) => {
  return {
    unreadCount: state.myChatReducer.unreadCount
  }
};

export default connect(mapStateToProps)(NotificationCounter);