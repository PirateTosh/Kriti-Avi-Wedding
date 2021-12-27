import React, { Component } from 'react';
import { fetchGender,fetchCountry } from '../../selectors';
import cloneDeep from "lodash/cloneDeep";
import $ from 'jquery';
export default class RsvpRegistration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            guestData2:false,
        }
        this.handleChange = this.handleChange.bind(this);
    }
    registerRsvp() {

        let data = {
            guestTitle: this.refs.title.value,
            guestFirstName: this.refs.firstName.value,
            guestLastName: this.refs.lastName.value,

            guestContactNo: this.refs.phone_number.value,
            guestAddressNationality: this.refs.country.value
        }
        var registerData=cloneDeep(data);
        this.props.registerRsvp(registerData);

    }
    registerRsvpCompanion() {

        let data = {
            guestTitle: this.refs.c_title.value,
            guestFirstName: this.refs.c_firstName.value,
            guestLastName: this.refs.c_lastName.value,
            guestPersonalEmail: this.refs.c_email.value,
            guestContactNo: this.refs.c_phone_number.value,
            guestAddressNationality: this.refs.c_country.value
        }
        var registerData=cloneDeep(data);
        this.props.registerRsvpCompanion(registerData);
    }
    rsvpAskYes() {
        this.props.rsvpAskYes();
    }
    rsvpAskNo() {
        this.props.rsvpAskNo();
    }
    handleChange(event) {
          console.log('actual',event.target);
          let data=cloneDeep(this.state.guestData2);
          
            data[event.target.name]=event.target.value;
          //  $(event.target.id).val(event.target.value);
          console.log('new data',data);
        //   let data = {
        //     guestTitle: this.refs.title.value,
        //     guestFirstName: this.refs.firstName.value,
        //     guestLastName: this.refs.lastName.value,
        //     email: this.refs.email.value,
        //     guestContactNo: this.refs.phone_number.value,
        //     guestAddressNationality: this.refs.country.value
        //   }

          this.setState({guestData2:data});
    }

    render() {
        console.log('check R3> guest Info', this.props.guestinformation);
        console.log('check R3> current guestId', this.props.currentGuestId);

        if (this.props.guestinformation && this.props.currentGuestId) {
            this.props.guestinformation.map((data) => {
                if (data._id == this.props.currentGuestId && !this.state.guestData2)  {
                    this.state.guestData2 = cloneDeep(data);
                    console.log('state data', (this.state.guestData2));
                    console.log('state data2', data);

                }
            });
        }

        console.log('check R3> guestData', this.state.guestData2);
        let list = fetchGender();
        let country_list = fetchCountry();
        return (

            <div className="container-fluid " style={{ paddingTop: "111px" }}>
                <div className="row">
                    <div className="col-sm-12 col-xs-12 col-md-8 col-lg-8 appGradientColor formStyle appBodyFontColor rsvpFormPadding">
                        <form className="form-horizontal" role="form" id="rsvpRegisterForm">
                            <h2 className="appBodyFontFamily appBodyFontColor" style={{paddingBottom:'20px',fontSize:'18px'}}>Please fill in your detail below</h2>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="bs-docs-example form-group">
                                        <select className="selectpicker form-control  appBodyFontFamily appBodyFontColor" data-style="btn-primary" ref='title' onChange={this.handleChange} value={this.state.guestData2.guestTitle} name="guestTitle">
                                            <option value="">Select Title</option>
                                            {list && list.map((item) => {
                                                return <option key={item.id} onChange={this.handleChange} defaultValue={item.name}>{item.name}</option>;
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <input type="text" id="firstName" ref='firstName' placeholder="First Name" className="form-control appBodyFontFamily appBodyFontColor" autoFocus onChange={this.handleChange} value={this.state.guestData2.guestFirstName}  name="guestFirstName"/>

                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group appBodyFontFamily appBodyFontColor">

                                        <input type="text" id="lastName" ref='lastName' placeholder="Last Name" className="form-control appBodyFontFamily appBodyFontColor" autoFocus onChange={this.handleChange} value={this.state.guestData2.guestLastName} name="guestLastName"/>

                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group appBodyFontFamily appBodyFontColor">

                                        <input readonly="readonly" type="email" id="email" ref='email' placeholder="Email" className="form-control appBodyFontFamily appBodyFontColor" name="email" onChange={this.handleChange} value={this.state.guestData2.guestPersonalEmail}  name="guestPersonalEmail" />

                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group appBodyFontFamily appBodyFontColor">

                                        <input type="phoneNumber" id="phoneNumber" ref='phone_number' placeholder="Phone number" className="form-control appBodyFontFamily appBodyFontColor" onChange={this.handleChange} value={this.state.guestData2.guestContactNo}  name="guestContactNo" />

                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group appBodyFontFamily appBodyFontColor">

                                        {/* <input type="text" id="country" placeholder="Nationality" ref='country' className="form-control appBodyFontFamily appBodyFontColor" value={this.state.guestData2.guestAddressNationality}  name="guestAddressNationality" onChange={this.handleChange}/> */}
                                        <select className="selectpicker form-control  appBodyFontFamily appBodyFontColor" data-style="btn-primary" ref="country"  id="country" value={this.state.guestData2.guestAddressNationality}  name="guestAddressNationality" onChange={this.handleChange}>
                                                <option value="">Select Country</option>
                                                {country_list && country_list.map((item) => {
                                                    return <option key={item.id} onChange={this.handleChange} defaultValue={item.name}>{item.name}</option>;
                                                })}
                                            </select>

                                    </div>
                                </div>
                            </div>
                            <button type="button" className="btn myInformationBtn" onClick={this.registerRsvp.bind(this)}>Save</button>
                        </form>
                        <div id="rsvpAsk" style={{ 'display': "none",marginTop:'40px' }}>
                            <h2 className="appBodyFontFamily appBodyFontColor" style={{paddingBottom:'20px',fontSize:'18px'}}>Do you want to register any companion?</h2>
                            <button type="button" className="btn myInformationBtn" onClick={this.rsvpAskYes.bind(this)} style={{marginRight:'10px'}}>Yes</button>
                            <button type="button" className="btn myInformationBtn" onClick={this.rsvpAskNo.bind(this)}>No</button>

                        </div>
                        <div id="rsvpCompanion" style={{ display:'none',marginTop:'40px' }}>
                            <form className="form-horizontal" role="form" id="rsvpCompanionForm">
                                <h2 className="appBodyFontFamily appBodyFontColor" style={{paddingBottom:'20px',fontSize:'18px'}}>Please fill in your companion's detail below</h2>
                                <div className="row">
                                <div className="col-md-6">
                                        <div className="bs-docs-example form-group">
                                            <select className="selectpicker form-control  appBodyFontFamily appBodyFontColor" data-style="btn-primary" ref="c_title"  >
                                                <option value="">Select Title</option>
                                                {list && list.map((item) => {
                                                    return <option key={item.id} onChange={this.handleChange} defaultValue={item.name}>{item.name}</option>;
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <input type="text" id="firstName" ref='c_firstName' placeholder="First Name" className="form-control appBodyFontFamily appBodyFontColor" autoFocus />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <input type="text" id="lastName" ref='c_lastName' placeholder="Last Name" className="form-control appBodyFontFamily appBodyFontColor" autoFocus/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">

                                            <input type="email" id="email" ref='c_email' placeholder="Email" className="form-control appBodyFontFamily appBodyFontColor" name="email"/>

                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="form-group">

                                            <input type="phoneNumber" id="phoneNumber" ref='c_phone_number' placeholder="Phone number" className="form-control appBodyFontFamily appBodyFontColor" />

                                        </div>
                                    </div>

                                    <div className="col-md-6">

                                        <div className="form-group">

                                            {/* <input type="text" id="country" placeholder="India" ref='c_country' className="form-control appBodyFontFamily appBodyFontColor" /> */}
                                            <select className="selectpicker form-control  appBodyFontFamily appBodyFontColor" data-style="btn-primary" ref="c_country"  >
                                                <option value="">Select Country</option>
                                                {country_list && country_list.map((item) => {
                                                    return <option key={item.id} onChange={this.handleChange} defaultValue={item.name}>{item.name}</option>;
                                                })}
                                            </select>

                                        </div>
                                    </div>
                                </div>
                                <button type="button" className="btn myInformationBtn" onClick={this.registerRsvpCompanion.bind(this)}>Save</button>
                            </form>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}
