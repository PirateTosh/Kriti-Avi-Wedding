import store from "../../store";
import React, { Component } from "react";
import { browserHistory } from "react-router";
import { fetchGuestFamily, uploadPhoto, submitGuestDetails, guestClearPassport } from '../../api/guestInformationApi.js';
import { dataSavedSuccessfully } from "../../actions/popup.action";

const maxLength = 9;
const smallName = (name) => {
  if (name.length > maxLength) {
    return name.substring(0, maxLength - 3) + '...';
  }
  return name;
};

class Passport extends Component {
  constructor(props) {
    super(props);
    let pIs = this.props.familyMember[0].guestPassportImages;
    pIs = pIs ? pIs : [];
    this.state = {
      page1: null,
      page2: null,
      hasPassport: pIs.length > 0 ? true : null,
      passportImages: pIs,
      currentGuestId: this.props.familyMember[0].guestId
    };
    this.saveGuestDetails = this.saveGuestDetails.bind(this);
    this.saveInfo = this.saveInfo.bind(this);
  }

  saveInfo(information) {
    let { familyMember } = this.props;
    let currentGuest = familyMember.find(m => {
      return m.guestId === this.state.currentGuestId;
    });

    let primaryGuest = familyMember.find(m => {
      return m.guestIsPrimary;
    });

    let pis = currentGuest.guestPassportImages;
    pis = pis ? pis : [];

    let { guestPassportImages } = information;

    // if(guestPassportImages[0]) {
    //   pis[0] = guestPassportImages[0];
    // }

    // if(guestPassportImages[1]) {
    //   pis[1] = guestPassportImages[1];
    // }

    information.guestPassportImages = guestPassportImages;
    let info = {
      ...information,
      guestId: this.state.currentGuestId
    };

    submitGuestDetails(info).then(() => {
      fetchGuestFamily(primaryGuest.guestId).then(() => {
        this.props.setLoading(false);
      }).catch(er => {
        this.props.setLoading(false);
      });
    }).catch(er => {
      this.props.setLoading(false);
    });

  }

  saveGuestDetails() {
    if (!this.state.page1) {
      alert("Please select at least one picture");
      return;
    }
    this.props.setLoading(true);
    let self = this;
    uploadPhoto(this.state.page1).then((url1) => {
      if (self.state.page2) {
        uploadPhoto(this.state.page2).then((url2) => {
          self.saveInfo({
            guestPassportImages: [url1, url2]
          });
        });
      }
      else {
        self.saveInfo({
          guestPassportImages: [url1]
        });
      }
      self.props.setLoading(false);
      store.dispatch(dataSavedSuccessfully("Photo ID saved successfully"));
    }).catch(e => {
      alert("Upload Failed");
      self.props.setLoading(false);
    });
  }

  clearPassport() {
    let { familyMember } = this.props;
    let primaryGuest = familyMember.find(m => {
      return m.guestIsPrimary;
    });
    this.props.setLoading(true);
    guestClearPassport(this.state.currentGuestId).then(() => {
      fetchGuestFamily(primaryGuest.guestId).then(() => {
        this.props.setLoading(false);
      }).catch(er => {
        this.props.setLoading(false);
      });
    }).catch(er => {
      this.props.setLoading(false);
    });
  }

  setGuest(guestId) {
    let { familyMember } = this.props;

    let currentGuest = familyMember.find(m => {
      return m.guestId === this.state.currentGuestId;
    });
    let passportImages = currentGuest.passportImages;
    passportImages = passportImages ? passportImages : [];

    this.setState({
      currentGuestId: guestId,
      page1: null,
      page2: null,
      passportImages,
      hasPassport: passportImages.length > 0 ? true : null
    })
  }

  componentWillReceiveProps(nextProps) {
    let { familyMember } = nextProps;
    let currentGuest = familyMember.find(m => {
      return m.guestId === this.state.currentGuestId;
    });

    this.setState({
      hasPassport: currentGuest.guestPassportImages && currentGuest.guestPassportImages.length > 0 ? true : null
    });
  }

  render() {
    let { familyMember } = this.props;
    let currentGuest = familyMember.find(m => {
      return m.guestId === this.state.currentGuestId;
    });
    let passportImages = currentGuest.guestPassportImages;
    passportImages = passportImages ? passportImages : [];
    let pis = passportImages;
    return (
      <div>
        <div className="card-header myInformation-card-header appBodyFontColor appGradientColor collapsed" data-toggle="collapse" data-parent="#accordion" href="#SPECIAL ASSISTANCE">
          <a className="card-title">
            <i className="icon-id-card" aria-hidden="true" />  MY PHOTO ID<i className="fa fa" aria-hidden="true" />
          </a>
        </div>
        <div id="SPECIAL ASSISTANCE" className="card-body myInformation-card-body appGradientColor collapse" data-parent="#accordion" >
          <div className="row">
            <div className="myPassportBtnTop">
              {familyMember && familyMember.map(guest => {
                return <button className={`btn btn-default btn-responsive ankur appBodyFontFamily appBodyFontColor ${(guest.guestId === currentGuest._id) ? "active" : ""}`} key={guest.guestId} id={guest.guestId} onClick={() => {
                  this.setGuest(guest.guestId);
                }}>{guest.guestName}</button>
              })}
            </div>
          </div>
          {pis.length > 0 ? null : <div>
            <div className="row">
              <p className="info-statement">{this.props.photoIDQuestion}</p>
              <p className="info-text">
                <i className="fa fa-info circleInfo" />
                <p className="inner-text">For international travel, please upload your passport your passport need to be valid a minimum of 6 month after the date of travel. For Domestic travel, please upload any of the Govt. approved IDs: Driving Licence, Aadhar Card, Voter ID</p>
              </p>
            </div>
            <div className="myPassportBtnRadio">
              {pis > 0 ? null :
                <form>
                  <div className="radio-group">
                    <input type="radio" id="option-one" name="selector" />
                    <label htmlFor="option-one" onClick={() => {
                      this.setState({ hasPassport: true, page1: null, page2: null });
                    }}>YES</label>
                    <input type="radio" id="option-two" name="selector" />
                    <label htmlFor="option-two" onClick={() => {
                      this.setState({
                        hasPassport: false
                      });
                    }}>NO</label>
                  </div>
                </form>
              }
            </div>
          </div>}
          {this.state.hasPassport || pis.length > 0 ?
            <div className="row text-center">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-sm-6">
                    {this.state.page1 || pis[0] ? <label className="btn-bs-file myInformationBtn ankur appBodyFontFamily appBodyFontColor active abl-filename" id="photoLabel" ><span>{smallName(this.state.page1 ? this.state.page1.name : 'Page 1')}</span></label> : null}
                    {this.state.page1 || pis[0] ? null : <div>
                      <label className="btn-bs-file Myaddress-btn-bs-file myInformationBtn" id="passportLabel" name="passport" onClick={() => {
                        this.refs.upload1.click();
                      }}>
                        UPLOAD PAGE 1
                      </label>
                      <input type="file" tabIndex="0" id="passport" accept="image/*,application/pdf" className="myInformationBtn" ref='upload1' style={{ display: 'none' }} onChange={(e) => {
                        this.setState({
                          page1: e.target.files[0]
                        });
                      }} />
                    </div>}
                    <canvas id="canvas" height="420" width="560" className="camera-box" style={{ display: "none" }} />
                    <span id="uploadPassportError" style={{ color: 'white' }} />
                  </div>
                  <div className="col-sm-6">
                    {this.state.page2 || pis[1] ? <label className="btn-bs-file myInformationBtn ankur appBodyFontFamily appBodyFontColor active abl-filename" id="photoLabel" ><span>{smallName(this.state.page2 ? this.state.page2.name : 'Page 2')}</span></label> : null}
                    {this.state.page2 || (pis[1] || pis[0]) ? null : (<div>
                      <label className="btn-bs-file Myaddress-btn-bs-file myInformationBtn" id="passport2Label" name="passport" onClick={() => {
                        this.refs.upload2.click();
                      }}>
                        UPLOAD PAGE 2
                    </label>
                      <input type="file" tabIndex="0" id="passport2" accept="image/*,application/pdf" className="myInformationBtn" style={{ display: 'none' }} ref='upload2' onChange={(e) => {
                        this.setState({
                          page2: e.target.files[0]
                        });
                      }} />
                    </div> : "null" )}
                    <canvas id="canvas" height="420" width="560" className="camera-box" style={{ display: "none" }} />
                    <span id="uploadPassportError" style={{ color: 'white' }} />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="update-info">Please click save button to save your changes.</div>
                <button className="myInformationBtn btnSave" id="save-passport-btn" onClick={() => {
                  pis.length > 0 ? this.clearPassport() : this.saveGuestDetails();
                }}>{pis.length > 0 ? 'CLEAR' : 'SAVE'}</button>
              </div>
            </div> : null
          }
          {this.state.hasPassport === false ?
            <div className="row text-center">
              <div className="col-md-12">
                <p className="disable-msg">Please get in touch with a travel representative to get assistance regarding your travel.</p>
              </div>
              <div className="col-md-12">
                <button className="myInformationBtn btnSave" onClick={() => { browserHistory.push("/contactUs") }}>go to contact us page</button>
              </div>
            </div>
            : null
          }
        </div>
      </div>
    );
  }
}
export default Passport;