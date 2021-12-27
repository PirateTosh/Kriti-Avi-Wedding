import React from "react";
import './myinformation.css';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {getEventId, getGuestInformation, getGuestId, fetchGender} from "../../selectors";
import {connect} from "react-redux";
import Details from "./details"
import cloneDeep from "lodash/cloneDeep";
import '../../config/config.js';
import '../common.css';
import $ from 'jquery';
import {fetchGuestInformation} from "../../api/guestInformationApi";
import {checkIsUserLoggedIn} from '../../api/storageAPI';
import {browserHistory} from "react-router";
import {isMobile, AppTItle, AppShortName} from  '../../config/config.js';
import Popup from 'react-popup';
import {confirmBox} from '../confirmContent/confirmFile';

class myInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guestInformation: cloneDeep(props.guestInformation),
      name: '',
      Mname: '',
      Lname: '',
      country: '',
      email: '',
      number: '',
      password: '',
      conformPasword: '',
      city: '',
      addressLine1: '',
      addressLine2: '',
      pincode: '',
      state: '',
      landmark: '',
      gender:'',
      dob:'',
      startDate: moment()
    };
    if (!navigator.onLine) {
      confirmBox();
    }
    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() != "true") {
      browserHistory.push("/");
    };
    this.sessionEventId = '';
    this.sessionGuestId = '';
  }

  componentDidMount() {
    this.sessionEventId = localStorage.getItem('eventId');
    this.sessionGuestId = localStorage.getItem('guestId');
    fetchGuestInformation(this.props.guestId || this.sessionGuestId, false);
    if(isMobile){
      $("#spanHeaderText").html("My Information");
      $(".notificationBell").show();
      $(".appLogo").hide()
      $(".chat").show();
    }
    $('html').scrollTop(0) ;
  }

  checkName(e) {
    var nameValue = e.target.value;
    this.setState({
      name: nameValue
    })
  }

  validName() {
    var nameValue = document.getElementById('nameid').value;
    var nameExp = /^[a-zA-Z]*$/;
    if (nameValue === "") {
      document.getElementById('ErrorName').innerHTML = "* Name should not be empty ";
      return false;
    }
    else if (!nameValue.match(nameExp)) {
      document.getElementById('ErrorName').innerHTML = "* Only charecter Alowed";
      return false;
    }
    else {
      document.getElementById('ErrorName').innerHTML = "";
      return true;
    }
  }

  checkMName(e) {
    var nameValue = e.target.value;
    this.setState({
      Mname: nameValue
    })
  }

  validMName() {
    var nameValue = document.getElementById('Mnameid').value;
    var nameExp = /^[a-zA-Z]*$/;
    if (nameValue === "") {
      document.getElementById('ErrorMName').innerHTML = "* Middle name should not be empty ";
      return false;
    }
    else if (!nameValue.match(nameExp)) {
      document.getElementById('ErrorMName').innerHTML = "* Only charecter Alowed";
      return false;
    }
    else {
      document.getElementById('ErrorMName').innerHTML = "";
      return true;
    }
  }

  checkLName(e) {
    var nameValue = e.target.value;
    this.setState({
      Lname: nameValue
    })
  }

  validLName() {
    var nameValue = document.getElementById('Lnameid').value;
    var nameExp = /^[a-zA-Z]*$/;
    if (nameValue === "") {
      document.getElementById('ErrorLName').innerHTML = "* Last name should not be empty ";
      return false;
    }
    else if (!nameValue.match(nameExp)) {
      document.getElementById('ErrorLName').innerHTML = "* Only charecter Alowed";
      return false;
    }
    else {
      document.getElementById('ErrorLName').innerHTML = "";
      return true;
    }
  }

  checkEmail(e) {
    var emailValue = e.target.value;
    this.setState({
      email: emailValue
    })
  }

  validEmail() {
    var emailValue = document.getElementById('emailid').value;
    var emailExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (emailValue === "") {
      document.getElementById('ErrorEmail').innerHTML = "* Email should not be empty";
      return false;
    }
    else if (!emailExp.test(emailValue)) {
      document.getElementById('ErrorEmail').innerHTML = "Please enter the valid Email ";
      return false;
    }
    else {
      document.getElementById('ErrorEmail').innerHTML = "";
      return true;
    }
  }

  checkNumber(e) {
    var numberValue = e.target.value;
    this.setState({
      number: numberValue
    })
  }

  validNumber() {
    var numberValue = document.getElementById('numberid').value;
    var numberExp = /^\d{10}$/;

    if (numberValue === "") {
      document.getElementById('NumberError').innerHTML = "* Number should not be empty";
      return false;
    }
    else if (!numberValue.match(numberExp)) {
      document.getElementById('NumberError').innerHTML = "* Please enter the correct phone number";
      return false;
    }
    else {
      document.getElementById('NumberError').innerHTML = "";
      return true;
    }
  }

  checkCountry(e) {
    var nameValue = e.target.value;
    this.setState({
        country: nameValue
    })
  }

  validCountry() {
    var nameValue = document.getElementById('countrynameid').value;
    var nameExp = /^[a-zA-Z]*$/;
    if (nameValue === "") {
      document.getElementById('ErrorCountry').innerHTML = "* Country should not be empty ";
      return false;
    }
    else if (!nameValue.match(nameExp)) {
      document.getElementById('ErrorCountry').innerHTML = "* Only charecter Alowed";
      return false;
    }
    else {
      document.getElementById('ErrorCountry').innerHTML = "";
      return true;
    }
  }

  checkALine1(e){
    var nameValue=e.target.value;
    this.setState({
      addressLine1:nameValue
    })
  }

  validALine1(){
    var nameValue=document.getElementById('Aline1').value;
    var nameExp= /^[a-zA-Z]*$/;
    if(nameValue===""){
      document.getElementById('ErrorAline1').innerHTML="* ADDRESS LINE1 should not be empty ";
      return false;
    }
    else if(!nameValue.match(nameExp)){
      document.getElementById('ErrorAline1').innerHTML="* Only charecter Alowed";
      return false;
    }
    else{
      document.getElementById('ErrorAline1').innerHTML="";
     return true;
    }
  }

  checkALine2(e){
    var nameValue=e.target.value;
    this.setState({
      addressLine2:nameValue
    })
  }

  validALine2(){
    var nameValue=document.getElementById('Aline2').value;
    var nameExp= /^[a-zA-Z]*$/;
    if(nameValue===""){
      document.getElementById('ErrorAline2').innerHTML="* ADDRESS LINE2 should not be empty ";
      return false;
    }
    else if(!nameValue.match(nameExp)){
      document.getElementById('ErrorAline2').innerHTML="* Only charecter Alowed";
      return false;
    }
    else{
      document.getElementById('ErrorAline2').innerHTML="";
      return true;
    }
  }

  checkPincode(e){
    var numberValue=e.target.value;
    this.setState({
      pincode:numberValue
    })
  }

  validPincode(){
    var numberValue=document.getElementById('pincode').value;
    var numberExp =   /^\d{4}$/;
    if(numberValue===""){
      document.getElementById('ErrorPincode').innerHTML="* Pincode should not be empty";
      return false;
    }
    else if(!numberValue.match(numberExp )){
      document.getElementById('ErrorPincode').innerHTML="* Pincode should be 4 digit And only number";
      return false;
    }
    else{
      document.getElementById('ErrorPincode').innerHTML="";
      return true;
    }
  }

  checkCity(e){
    var nameValue=e.target.value;
    this.setState({
      city:nameValue
    })
  }

  validCity(){
    var nameValue=document.getElementById('city').value;
    var nameExp= /^[a-zA-Z]*$/;
    if(nameValue===""){
      document.getElementById('ErrorCity').innerHTML="* City should not be empty ";
      return false;
    }
    else if(!nameValue.match(nameExp)){
      document.getElementById('ErrorCity').innerHTML="* Only charecter Alowed";
      return false;
    }
    else{
      document.getElementById('ErrorCity').innerHTML="";
      return true;
    }
  }

  checkState(e){
    var nameValue=e.target.value;
    this.setState({
      state:nameValue
    })
  }

  validState(){
    var nameValue=document.getElementById('state').value;
    var nameExp= /^[a-zA-Z]*$/;
    if(nameValue===""){
      document.getElementById('ErrorState').innerHTML="* State should not be empty ";
      return false;
    }
    else if(!nameValue.match(nameExp)){
      document.getElementById('ErrorState').innerHTML="* Only charecter Alowed";
      return false;
    }
    else{
      document.getElementById('ErrorState').innerHTML="";
      return true;
    }
  }

  fileValidationPhoto(){
    var fileInput= document.getElementById("fileId");
    var filePath=fileInput.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if(!allowedExtensions.exec(filePath)){
      document.getElementById('fileError').innerHTML="Plz upload a file .jpg .jpeg .png .gif";
      fileInput.value = '';
      return false;
    }
    else {
      //Image preview
      if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('fileError').innerHTML="";
        };
        reader.readAsDataURL(fileInput.files[0]);
      }
    }
  }

  fileValidationPaasport(){
    var fileInput= document.getElementById("uploadPassport");
    var filePath=fileInput.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if(!allowedExtensions.exec(filePath)){
      document.getElementById('uploadPassportError').innerHTML="Plz upload a file .jpg .jpeg .png .gif";
      fileInput.value = '';
      return false;
    }
    else{
      //Image preview
      if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('uploadPassportError').innerHTML="";
        };
        reader.readAsDataURL(fileInput.files[0]);
      }
    }
  }

  fileValidationVisa(){
    var fileInput= document.getElementById("visaUpload");
    var filePath=fileInput.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if(!allowedExtensions.exec(filePath)){
      document.getElementById('visaUploadError').innerHTML="Plz upload a file .jpg .jpeg .png .gif";
      fileInput.value = '';
      return false;
    }
    else{
      //Image preview
      if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('visaUploadError').innerHTML="";
        };
        reader.readAsDataURL(fileInput.files[0]);
      }
    }
  }

  render() {
    $('.backIcon').show();
    $('.backIconMobile').show();
    let guestInformation = this.state.guestInformation;
    let list = fetchGender();
    return (
      <div className="container appBodyFontFamily">
        <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block">MY INFORMATION</h3>
        <div className="row secondRow pTop90">
          <div className="col-md-2"/>
          <div className="col-md-8">
            <div id="accordion" className="accordion">
              <div className="card myInformation-card mb-0">
                <Details  list={list}/>
              </div>
            </div>
          </div>
          <div className="col-md-2"/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    guestInformation: getGuestInformation(state),
    eventId: getEventId(state),
    guestId: getGuestId(state)
  }
}

export default connect(mapStateToProps)(myInformation);