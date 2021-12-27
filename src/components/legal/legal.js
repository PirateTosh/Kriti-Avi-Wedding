import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-web-meteor';
import {browserHistory} from "react-router";
import $ from 'jquery'
import './legal.css';

class Legal extends Component{
  componentDidMount() { 
    $('#spanHeaderText').text('legal');
    $('html').scrollTop(0) ;
  }
  render(){
    let styles = {
      link : {
        maxWidth : '400px',
        padding : '15px',
      }
    }
    $('.backIcon').show();
    $('.backIconMobile').show();
      return(
        <div className="container-fluid respobsiveMarginTop contactusmaincontent">
          <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily">  </h3>
          <div className="">
            <div className="row"> 
              <div className="col-sm-12 appGradientColor contactUs appBodyFontColor" style={styles.link}>
                <p className="appBodyFontFamily appBodyFontColor"><a onClick={() => {browserHistory.push("/legal/privacy-policy")}} className="appBodyFontColor tel appBodyFontFamily"> <span>PRIVACY POLICY</span></ a></p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12  appGradientColor contactUs appBodyFontColor" style={styles.link}>
                <p className="appBodyFontFamily appBodyFontColor"><a onClick={() => {browserHistory.push("/legal/terms-of-service")}} className="appBodyFontColor tel appBodyFontFamily"> <span>TERMS OF SERVICE</span></ a></p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12  appGradientColor contactUs appBodyFontColor" style={styles.link}>
                <p className="appBodyFontFamily appBodyFontColor"><a onClick={() => {browserHistory.push("/legal/user-agreement")}} className="appBodyFontColor tel appBodyFontFamily"> <span>USER AGREEMENT</span></ a></p>
              </div>
            </div>
          </div>
        </div>
      );
  }
}
export default Legal;