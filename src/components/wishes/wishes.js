import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component'
// import Meteor, { createContainer } from 'react-web-meteor';
import {getWelcomeDetails, getGuestId, getGuestLoggedIn} from "../../selectors";
import {fetchWelcomeDetails} from "../../api/welcomeApi";
import {fetchEventDetails} from "../../api/eventDetailsApi";
import {fetchLoggedInGuest} from "../../api/guestInformationApi";
import {saveGuestWishesandFeedback} from "../../api/guestInformationApi";
import {connect} from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import $ from 'jquery';
import {checkIsUserLoggedIn} from '../../api/storageAPI';
import {browserHistory} from "react-router";
import set from "lodash/set";
import get from "lodash/get";
import {confirmBox} from '../confirmContent/confirmFile';

import './wishes.css';
import {isMobile, AppTItle, AppShortName} from  '../../config/config.js';
import '../common.css';

class Wishes extends Component {

    constructor(props) {
        super(props);
        this.state = {
          guestInformation: cloneDeep(props.guestInformation),
            welcomeData : cloneDeep(props.welcomeData),
            wishData: '',
            feedbackData: {},
            ratings: {
              
            },
            anyothersuggestionAnswer: ''
        };
        this.handleChange = this.handleChange.bind(this);
        if (!navigator.onLine) {
            console.log("offline");
            confirmBox();
        }
        if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
            console.log('::: NOT LOGGED IN :::');
            browserHistory.push("/");
          }
        this.sessionEventId = '';
        this.sessionGuestId = '';
    }
    handleChange(event) {
      this.setState({wishData: event.target.wishData});
    }
    componentWillReceiveProps(nextProps) {
      this.sessionEventId = localStorage.getItem('eventId');
      this.sessionGuestId = localStorage.getItem('guestId');
        if (!nextProps.welcomeData) {
            fetchWelcomeDetails();
        }
        if (this.props.welcomeData !== nextProps.welcomeData) {
            this.setState({welcomeData: cloneDeep(nextProps.welcomeData)});
        }
        if (!nextProps.guestInformation) {
          fetchLoggedInGuest(this.props.guestId || this.sessionGuestId, false);
      }
      if (this.props.guestInformation !== nextProps.guestInformation) {
          this.setState({guestInformation: cloneDeep(nextProps.guestInformation)});
      }
        if (!nextProps.eventDetails) {
            fetchEventDetails(this.props.guestId, true);
        }
        if (this.props.eventDetails !== nextProps.eventDetails) {
            this.setState({eventDetails: cloneDeep(nextProps.eventDetails)});
        }
        const wishDataStr = nextProps.guestInformation &&  nextProps.guestInformation.guestWish;
        console.log("wishData");
        console.log(wishDataStr);
        this.setState({wishData:wishDataStr});
        const noOfQuestions = this.props.welcomeData &&  this.props.welcomeData.feedbackQuestions &&  this.props.welcomeData.feedbackQuestions.length;
    
        const ratings = {};
        const guestFeedbacks = this.props.guestInformation &&  this.props.guestInformation.guestFeedbacks;
        console.log(guestFeedbacks);
        console.log(noOfQuestions);
        let i;
        for (i=0;i < noOfQuestions;i++) {
          const name = 'key' + i;
          ratings[name] = guestFeedbacks ? guestFeedbacks[i].answer : 0;
        }
        if (noOfQuestions) {
          this.setState({
            ratings: ratings, //anyothersuggestionAnswer:guestFeedbacks[noOfQuestions]
          });
        }
        const otherFeedback = this.props.guestInformation &&  this.props.guestInformation.guestFeedbacks &&  this.props.guestInformation.guestFeedbacks.length;
        if(otherFeedback)
        {
          let otherAnswer = guestFeedbacks?guestFeedbacks[otherFeedback-1].answer : '';
          this.setState({
            anyothersuggestionAnswer:otherAnswer
          });
          console.log(otherAnswer);
        }
        console.log(ratings);
        console.log("ratings");
    }

  componentDidMount() {
    this.sessionEventId = localStorage.getItem('eventId');
    this.sessionGuestId = localStorage.getItem('guestId');
    $('html').scrollTop(0) ;

    if(!this.props.welcomeData){
        fetchWelcomeDetails();
    }
      fetchLoggedInGuest(this.props.guestId || this.sessionGuestId, false);
    this.sessionEventId = localStorage.getItem('eventId');
    this.sessionGuestId = localStorage.getItem('guestId');
    console.log("guestID");
    console.log(this.sessionGuestId);
    const noOfQuestions = this.props.welcomeData &&  this.props.welcomeData.feedbackQuestions &&  this.props.welcomeData.feedbackQuestions.length;
    const wishDataStr = this.props.guestInformation &&  this.props.guestInformation.guestWish;
    console.log("wishData");
    console.log(wishDataStr);
    this.setState({wishData:wishDataStr});
    
    if(isMobile){
      $("#spanHeaderText").html("Feedback");
      $('.headingTop').hide();
      $(".notificationBell").show();
      $(".appLogo").hide()
      $(".chat").show();
      }

  }
  updateGuestDetail(event){
    const field = event.target.name;
    let guestInformation = cloneDeep(this.state.guestInformation);
        set(guestInformation,field, event.target.value);
        return this.setState({guestInformation: guestInformation});
}
  submitWishData() {
     const wishListDescription = this.refs.wishListDescription.value;
     const guestId = this.props.getGuestId || this.sessionGuestId ||  '';
     saveGuestWishesandFeedback({guestId: guestId, data: {guestWish : wishListDescription}}, 
      !(this.props.welcomeData && this.props.welcomeData.showFeedback && this.props.guestInformation && this.props.guestInformation.guestFeedbacks));
     
  }

  submitRating() {
      const guestId = this.props.getGuestId ? this.props.getGuestId : this.sessionGuestId;
      console.log("rate");
      console.log(guestId);
      const ratingData = [];
      this.props.welcomeData && this.props.welcomeData.feedbackQuestions.map((data, key) => {
        const ratdata = 'key' + key;
        ratingData.push({question: this.props.welcomeData.feedbackQuestions[key], 
                        answer: this.state.ratings[ratdata] || 0})
      });
      if (this.refs.anyothersuggestionAnswer.value !== '') {
  
        ratingData.push({
          question: 'Any other question',
          answer: this.refs.anyothersuggestionAnswer.value
        })
      }
      saveGuestWishesandFeedback({guestId: guestId, data: {guestFeedbacks : ratingData}}, 
      !(this.props.welcomeData && this.props.welcomeData.showFeedback && this.props.guestInformation && this.props.guestInformation.guestFeedbacks));
  }

  wishSection() {

    const title = this.props.welcomeData && this.props.welcomeData.wishesTitle; 
    const placeholder = this.props.welcomeData && this.props.welcomeData.wishesDescription; 
    const wishMessage = this.state.wishData;
    console.log("wishes");
    console.log(this.state.wishData);
    return (
      <div>

      <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily ">{title}</h3>

        <div className="row textAreaAlign">

          <textarea value={wishMessage} className="appBodyFontColor appBodyFontFamily" rows="12" cols="80" ref="wishListDescription" placeholder={placeholder} onChange={this.handleChange} >
          </textarea>

        </div>

        <div className="wishesBtn ">
          <input type="submit" className="appBodyFontFamily appBodyFontColor" value="SUBMIT" onClick= {this.submitWishData.bind(this)} />



        </div>
      </div>
      )

  }

  onStarClick(nextValue, prevValue, name) {
      const obj = {};
      obj[name] = nextValue
      const updatedState = Object.assign({}, this.state.ratings, obj);
      this.setState({
        ratings: updatedState
      });
  }

  ratingSection() {
    const feedbackQuestions = this.props.welcomeData && this.props.welcomeData.feedbackQuestions ;
    console.log("Feedback Questions ::::::::: ");
    const feedbackQues = Object.values(feedbackQuestions);
    console.log(feedbackQues[5]);
    console.log(this.state.ratings);
    // const lastQuestion = feedbackQuestions && feedbackQuestions[feedbackQuestions.length - 1];
    // feedbackQuestions && feedbackQuestions.splice(-1, 1);
    return (
            <div className="col-md-12 feedback-questions">
              {feedbackQuestions && feedbackQuestions.map( (data, key) => {
                const name = 'key' + key;
                const arr = [];
                const rateStar = this.state.ratings;
                console.log("ratestar");
                console.log(rateStar);
                if (data.replace(/\s/g, "") .toLowerCase() !== 'anyothersuggestion') {
                  return (
                    <div className={"row feedbackq"+key} key={data}>
                      <div className="col-md-6">
                      <p className="ratingp">{data}</p>
                      </div>
                      <div className="col-md-6 {key}">
                        <StarRatingComponent 
                          name={name}
                          emptyStarColor={"#fff"}
                          starCount={5}
                          value={this.state.ratings[name]}
                          onStarClick={this.onStarClick.bind(this)}
                          renderStarIcon={() => <span><i className="icon-feedback-star"></i></span>}
                        />
                      </div>
                    </div>
                    );
                } 
                })}
              {this.customFeedbackSection()}
              <div className="wishesBtn  col-md-12">
                <input type="submit" value="SUBMIT" className="ratingSubmit appBodyFontFamily appBodyFontColor" onClick={this.submitRating.bind(this)}/>
              </div>
            </div>
              
      )
  }
customFeedbackSection(){
  const feedbackQuestions = this.props.welcomeData && this.props.welcomeData.feedbackQuestions ;
  console.log("Feedback Questions ::::::::: ");
  const feedbackQues = Object.values(feedbackQuestions);
  console.log(feedbackQues[5]);
  // const feedbackAnswer = '';
  var name = 'key';
    {
      feedbackQuestions && feedbackQuestions.map( (data, key) => {
      name = 'key' + key;
      const arr = [];
      //if (data.replace(/\s/g, "").toLowerCase() === 'anyothersuggestion') {

    //} 
  })}
  if (this.refs.anyothersuggestionAnswer) {
    this.refs.anyothersuggestionAnswer.value = this.state.anyothersuggestionAnswer ||  '';
  }
  console.log("this.state.anyothersuggestionAnswer")
  console.log(this.state.anyothersuggestionAnswer);
  return (
    <div className="row feedbacktext">
     <div className="col-md-6">
       <p className="text-center ratingp"></p>
     </div>
     <div className="col-md-6 d-flex justify-content-center">
      <textarea className="appBodyFontColor appBodyFontFamily float-right ratingTextArea" dir="ltr" ref="anyothersuggestionAnswer" rows="5" cols="40" name={name} placeholder={feedbackQues[5]} style={{textAlign:'left'}}>
      </textarea>
     </div>
   </div>
   );
  
}
  feedbackSection() {
    return (
      
      <div className="row">
        <div className="col-md-12"><h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block">FEEDBACK</h3></div>
          <div className="col-md-2 mT90"></div>
          <div className="col-md-8 appGradientColor">
            <div className="row appBodyFontColor appBodyFontFamily">
              <div className="col-md-6">
                <p className="ratingp1 paragraphCommon appBodyFontColor appBodyFontFamily">Thank you for attending our event.</p>
              </div>
              <div className="col-md-6">
                <p className="ratingp"></p>
              </div>
              {this.ratingSection()}
             
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
    )
  }

  showSection() {
     if (this.props.welcomeData && this.props.welcomeData.showFeedback) {
      return this.feedbackSection()
     } else {
      return this.wishSection()
    }
  }

  render() {
    
    console.log("Welcomedata");
    console.log(this.props.welcomeData);
    console.log(this.props.guestInformation);
    $('.backIcon').show();
    $('.backIconMobile').show();
 
    return (
      <div className="container">
        {this.showSection()}
      </div>



    );

  }

}

function mapStateToProps(state) {
    return{
      guestInformation: getGuestLoggedIn(state),
        welcomeData: getWelcomeDetails(state),
        getGuestId: getGuestId(state),
    }
}

export default connect(mapStateToProps)(Wishes);
