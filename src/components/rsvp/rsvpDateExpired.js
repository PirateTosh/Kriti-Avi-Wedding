import React, { Component } from 'react';
import {browserHistory} from "react-router";

export default class RsvpDateExpired extends Component{

	goToContactPage () {
		browserHistory.push("/contactUs");
	}

	render(){
		return (
      <div className="row third-rsvp" style={{marginTop:'100px'}}>
      <div className="col-md-4"></div>
      <div className="col-md-4 appGradientColor appBodyFontFamily appBodyFontColor third-rsvp-content">
      <p>The last date for updating your RSVP has passed by. Please contact the RSVP desk to update your response</p>
       <div className="BtnCommon responsiveBtn">
              <button className="btn commonBtnDestination appBodyFontFamily appBodyFontColor" style={{display:"inline-block"}} onClick= {this.goToContactPage.bind(this)}>GO TO CONTACT US PAGE</button>
          </div>
      </div>
      <div className="col-md-4"></div>
      </div>
	)
	}
}
