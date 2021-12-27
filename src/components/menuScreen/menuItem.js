import React, { Component } from 'react';
import {browserHistory} from "react-router";

class MenuItem extends React.Component {
  render(){
    let style = {
      menuItem: {
        position: 'relative',
        flex : '33%',
        display : 'flex',
        flexDirection : 'column'
      },
      icon: {
        display: 'flex',
        alignItems : 'center',
        justifyContent : 'center',
        height: '60px',
        width: '60px',
        borderRadius : '50%',
        border : 'solid 1px',
        fontSize: '32px',
        margin : '0 auto',
        marginBottom : '10px'
      },
      iconName: {
        fontSize: '14px',
        textTransform : 'uppercase',
        display : 'flex',
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center'
      }
    }
    let { name, icon, link } = this.props;
    return(
      <div className="appBodyFontFamily appBodyFontColor" style={style.menuItem} onClick={() => { browserHistory.push("/"+link)}}>
        <div style={style.icon} className={icon}></div>
        <p style={style.iconName}>{name}</p>
      </div>
    )
  }
}

export default MenuItem;