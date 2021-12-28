import React from "react";
const Address = ({ familyMember, guestFamilyDetails, guestDetailHandler, airportList, countryList, saveDetails, getGuestFamilyDetail }) => {
    return (
        <div className="informationScreenDivides appBodyFontFamily">
            <div className="card-header myInformation-card-header appBodyFontColor appGradientColor collapsed" data-toggle="collapse"
                data-parent="#accordion" href="# MERCHANDIZE SIZE">
                <a className="card-title">
                    <i className="icon-my-address" aria-hidden="true" />MY ADDRESS<i className="fa fa" aria-hidden="true" />
                </a>
            </div>
            <div id=" MERCHANDIZE SIZE" className="card-body myInformation-card-body appGradientColor  collapse" data-parent="#accordion">
                <div className="row">
                    <div className="myPassportBtnTop">
                        {familyMember && familyMember.map(guest => {
                            return <button className={`btn btn-default btn-responsive ankur appBodyFontFamily appBodyFontColor ${(guest.guestId === guestFamilyDetails._id) ? "active" : ""}`} key={guest.guestId} id={guest.guestId} onClick={getGuestFamilyDetail}>{guest.guestName}</button>
                        })}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <input type="text" className="form-control form-control-color appBodyFontFamily appBodyFontColor" id="Aline1" name="guestAddress1"
                            placeholder="ADDRESS LINE1" value={guestFamilyDetails.guestAddress1}
                            onChange={guestDetailHandler} />
                        <span id="ErrorAline1" style={{ color: 'white' }} />
                    </div>
                    <div className="col-md-6">
                        <input type="text" className="form-control form-control-color appBodyFontFamily appBodyFontColor" id="Aline2"
                            placeholder="ADDRESS LINE2" value={guestFamilyDetails.guestAddress2} name="guestAddress2"
                            onChange={guestDetailHandler} />
                        <span id="ErrorAline2" style={{ color: 'white' }} />
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-6">
                        <input type="text" className="form-control form-control-color appBodyFontFamily appBodyFontColor" id="city" placeholder="CITY"
                            value={guestFamilyDetails.guestAddressCity}
                            onChange={guestDetailHandler} name="guestAddressCity" />
                        <span id="ErrorCity" style={{ color: 'white' }} />
                    </div>
                    <div className="col-md-6">
                        <input type="text" className="form-control form-control-color appBodyFontFamily appBodyFontColor" id="state" name="guestAddressState"
                            placeholder="STATE" value={guestFamilyDetails.guestAddressState}
                            onChange={guestDetailHandler} />
                        <span id="ErrorState" style={{ color: 'white' }} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <input type="text" className="form-control form-control-color appBodyFontFamily appBodyFontColor" id="pincode"
                            placeholder="PINCODE" value={guestFamilyDetails.guestAddressPincode} name="guestAddressPincode"
                            onChange={guestDetailHandler} />
                        <span id="ErrorPincode" style={{ color: 'white' }} />
                    </div>
                    <div className="col-md-6">
                        <input type="text" className="form-control form-control-color appBodyFontFamily appBodyFontColor" id="Lmark" name="guestAddressLandmark"
                            value={guestFamilyDetails.guestAddressLandmark} placeholder="LANDMARK" onChange={guestDetailHandler} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <select className="form-control form-control-color appBodyFontFamily appBodyFontColor" data-live-search="true" data-size="10"
                            onChange={guestDetailHandler} value={guestFamilyDetails.guestAddressNationality} name="guestAddressNationality" >
                            <option value="" disabled>Select Country</option>

                            {countryList && countryList.map((item) => {
                                return <option key={item.id} value={item._id}>{item.name}</option>;
                            })}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <select className="form-control form-control-color appBodyFontFamily appBodyFontColor" data-live-search="true" data-size="10"
                            onChange={guestDetailHandler} value={guestFamilyDetails.guestNearestAirport} name="guestNearestAirport" >
                            <option value="" disabled>Select Nearest Airport</option>
                            {airportList && airportList.map((item) => {
                                return <option key={item._id} value={item._id}>{item.airportIATA}, {item.airportCountry}</option>;
                            })}
                        </select>
                    </div>
                </div>

                <div className="row">
                    <button className="myInformationBtn btnSave" onClick={saveDetails}>SAVE</button>
                </div>
            </div>
        </div>
    );
};

export default Address;
