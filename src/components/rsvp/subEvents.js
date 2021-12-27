import React, { Component } from 'react';
import $ from 'jquery';
export default class SubEvents extends Component{

	submitEvents = (data, id,activeBtnId)=>{
		console.log(this);
		console.log('inside methodddd',data);
		console.log('inside methodddd',id);
		const {onClick} = this.props
		onClick(data, id)
		$('#'+activeBtnId).nextAll().removeClass('active');
		$('#'+activeBtnId).prevAll().removeClass('active');
		
		$('#'+activeBtnId).addClass('active');

	}

	render(){
		const event = [{label: 'ATTENDING', value: true,identifier:'attending'}, {label: 'MAYBE', value: 'intermediate',identifier:'maybe'}, {label: 'REGRET' ,value: false,identifier:'regret'}]
		return (
	    <div className="row rsvpContent" key={this.props.index} id={this.props.index}>
				<div className="col-md-1"></div>
				<div className="col-md-10 appGradientColor rsvpPaddingRow" >
						<div className="row">
								<div className="col-md-4 appBodyFontColor">
										<div className="pClass">
												<p className="rsvpPheading appBodyFontColor appBodyFontFamily">{this.props.event.subEventTitle}</p>
												<p className="">{this.props.event.subEventStartTime}</p>
												
										</div>
								</div>
								<div className="col-md-8">
										<div className="BtnCommon adjustPadding"><div className="rsvp radio-group">{
												
												event.map ((data)=>{ 
													
													var guestid=this.props.guestId;
													
													var selected=false;
													// console.log('check persitance',this.props.event._id);
													// console.log('check persitance2',data.value);
													// console.log('check persitance3 guest',guestid);
													

													if(this.props.guestId && this.props.rsvpDetails){
														this.props.rsvpDetails.map((guestData)=>{
															if(guestData.guestId==guestid && guestData.rsvpInfo){
																guestData.rsvpInfo.map((statusData)=>{
																	// console.log('check persistance status',statusData);
																	if(statusData._id && this.props.event._id && statusData._id==this.props.event._id ){
																		if(statusData.status==data.value){
																			selected=true;
																		console.log("is Selected",selected);
																		console.log(data.value);
																		console.log(statusData.status);
																		}
																		
																	}
																});
															}
														});
													}else{
														if(!selected && data.value=="intermediate"){
															selected=true;
														}
													}
													
													return <button id={(this.props.index)+data.identifier} className={`btn commonBtnDestination appBodyFontFamily appBodyFontColor rsvp-hide ${(selected)?"active":"" }` } rel={data.label}  onClick ={()=>{this.submitEvents(data, this.props.event,((this.props.index)+data.identifier))}}> {data.label} </button>
													// return(
													// 	<div>
													// 	<input type="radio" id={this.props.event._id+data.value} name={this.props.event._id} checked={selected?'checked':""} />
                           							// 	 <label htmlFor={this.props.event._id+data.value}  onClick ={()=>{this.submitEvents(data, this.props.event)}}>{data.label}</label>
													// 		</div>
													// )
												}
											
											)
										}
										</div>
										</div>
								</div>
						</div>
				</div>
				<div className="col-md-1"></div>
			</div>
	)
	}
}
