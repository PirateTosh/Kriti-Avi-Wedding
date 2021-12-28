import React from "react";
import store from "../../store";
import { browserHistory } from "react-router";
import {
  fetchGuestFamily,
  uploadPhoto,
  submitGuestDetails,
  guestClearInsurance,
} from "../../api/guestInformationApi.js";
import { dataSavedSuccessfully } from "../../actions/popup.action";

const maxLength = 9;
const smallName = name => {
  if (name.length > maxLength) {
    return name.substring(0, maxLength - 3) + "...";
  }
  return name;
};
class Insurance extends React.Component {
  constructor(props) {
    super(props);
    let pIs = this.props.familyMember[0].guestInsuranceImages;
    pIs = pIs ? pIs : [];

    this.state = {
      page: null,
      insuranceImages: pIs,
      hasInsurance: pIs.length > 0 ? true : null,
      currentGuestId: this.props.familyMember[0].guestId,
    };
  }

  setGuest(guestId) {
    let { familyMember } = this.props;
    let currentGuest = familyMember.find(m => {
      return m.guestId === guestId;
    });
    let passportImages = [];
    if (typeof currentGuest.guestInsuranceImages == "undefined") {
      passportImages = [];
    } else {
      passportImages = currentGuest.guestInsuranceImages;
    }
    let insuranceImages = passportImages ? passportImages : [];
    this.setState({
      currentGuestId: guestId,
      insuranceImages,
      hasInsurance: insuranceImages.length > 0 ? true : null,
      page: null,
    });
  }

  saveInfo(information) {
    let { familyMember } = this.props;

    let primaryGuest = familyMember.find(m => {
      return m.guestIsPrimary;
    });

    let info = {
      ...information,
      guestId: this.state.currentGuestId,
    };

    submitGuestDetails(info)
      .then(() => {
        fetchGuestFamily(primaryGuest.guestId)
          .then(() => {
            this.props.setLoading(false);
          })
          .catch(er => {
            this.props.setLoading(false);
          });
      })
      .catch(er => {
        this.props.setLoading(false);
      });
  }

  clearInsurance() {
    let { familyMember } = this.props;
    let primaryGuest = familyMember.find(m => {
      return m.guestIsPrimary;
    });

    this.props.setLoading(true);
    guestClearInsurance(this.state.currentGuestId)
      .then(() => {
        fetchGuestFamily(primaryGuest.guestId)
          .then(() => {
            this.props.setLoading(false);
          })
          .catch(er => {
            this.props.setLoading(false);
          });
      })
      .catch(er => {
        this.props.setLoading(false);
      });
  }

  saveGuestDetails() {
    if (!this.state.page) {
      alert("Please select at least one picture");
      return;
    }
    this.props.setLoading(true);
    var self = this;
    uploadPhoto(this.state.page)
      .then(url => {
        self.saveInfo({
          guestInsuranceImages: [url],
        });
        self.props.setLoading(false);
        store.dispatch(
          dataSavedSuccessfully("Vaccination Certificate saved successfully")
        );
      })
      .catch(e => {
        alert("Upload failed");
        self.props.setLoading(false);
      });
  }

  componentWillReceiveProps(nextProps) {
    let { familyMember } = nextProps;

    let currentGuest = familyMember.find(m => {
      return m.guestId === this.state.currentGuestId;
    });

    this.setState({
      hasInsurance:
        currentGuest.guestInsuranceImages &&
        currentGuest.guestInsuranceImages.length > 0
          ? true
          : null,
    });
  }

  render() {
    let { appSettings, familyMember } = this.props;
    let currentGuest = familyMember.find(m => {
      return m.guestId === this.state.currentGuestId;
    });
    let passportImages = currentGuest.guestInsuranceImages;
    let insuranceImages = passportImages ? passportImages : [];
    let pis = insuranceImages;
    // let insuranceQuestion = appSettings ? appSettings.insuranceQuestion : '';
    let insuranceQuestion =
      "Do you have a valid COVID-19 vaccination certificate?";

    return (
      <div className="informationScreenDividesTop">
        <div
          className="card-header myInformation-card-header appBodyFontColor appGradientColor collapsed"
          data-toggle="collapse"
          data-parent="#accordion"
          href="#my-insurance"
        >
          <a className="card-title">
            <i className="icon-insurance" aria-hidden="true" />
            VACCINATION CERTIFICATE
            <i className="fa" aria-hidden="true" />
          </a>
        </div>
        <div
          id="my-insurance"
          className="card-body myInformation-card-body ankur appGradientColor collapse"
          data-parent="#accordion"
        >
          <div className="row">
            <div className="myPassportBtnTop">
              {familyMember &&
                familyMember.map(guest => {
                  return (
                    <button
                      className={`btn btn-default btn-responsive ankur appBodyFontFamily appBodyFontColor ${
                        guest.guestId === currentGuest._id ? "active" : ""
                      }`}
                      key={guest.guestId}
                      id={guest.guestId}
                      onClick={() => {
                        this.setGuest(guest.guestId);
                      }}
                    >
                      {guest.guestName}
                    </button>
                  );
                })}
            </div>
          </div>
          {pis.length > 0 ? null : (
            <div>
              <div className="row">
                <p className="info-statement appBodyFontFamily appBodyFontColor">
                  {insuranceQuestion}
                </p>
              </div>
              <div className="myPassportBtnRadio">
                <form>
                  <div className="radio-group">
                    <input type="radio" id="option-three" name="selector" />
                    <label
                      htmlFor="option-three"
                      onClick={() => {
                        this.setState({
                          hasInsurance: true,
                          page: null,
                        });
                      }}
                    >
                      YES
                    </label>
                    <input type="radio" id="option-four" name="selector" />
                    <label
                      htmlFor="option-four"
                      onClick={() => {
                        this.setState({
                          hasInsurance: false,
                        });
                      }}
                    >
                      NO
                    </label>
                  </div>
                </form>
              </div>
            </div>
          )}
          {this.state.hasInsurance || pis.length > 0 ? (
            <div>
              <div className="uploadInsurancePhotoId text-center">
                {this.state.page || pis[0] ? (
                  <label
                    className="btn-bs-file myInformationBtn ankur appBodyFontFamily appBodyFontColor active abl-filename"
                    id="insurancePhotoLabel"
                  >
                    <span>
                      {smallName(
                        this.state.page
                          ? this.state.page.name
                          : "upload vaccination certificate"
                      )}
                    </span>
                  </label>
                ) : null}
                {this.state.page || pis[0] ? null : (
                  <div>
                    <label
                      className="btn-bs-file Myaddress-btn-bs-file myInformationBtn"
                      id="insuranceLabel"
                      name="insuranceImage"
                      onClick={() => {
                        this.refs.insuranceUpload.click();
                      }}
                    >
                      {" "}
                      UPLOAD VACCINATION CERTIFICATE{" "}
                    </label>
                    <input
                      type="file"
                      tabIndex="0"
                      id="insuranceImage"
                      accept="image/*,application/pdf"
                      ref="insuranceUpload"
                      className="myInformationBtn"
                      style={{ display: "none" }}
                      onChange={e => {
                        this.setState({
                          page: e.target.files[0],
                        });
                      }}
                    />
                    <br />
                    <span
                      id="insuranceUploadError"
                      style={{ color: "white" }}
                    />{" "}
                  </div>
                )}
              </div>
              <div className="row">
                <div className="update-info">Click 'SAVE'</div>
                <button
                  className="myInformationBtn btnSave"
                  id="save-insurance-btn"
                  onClick={() => {
                    pis.length > 0
                      ? this.clearInsurance()
                      : this.saveGuestDetails();
                  }}
                >
                  {pis.length > 0 ? "CLEAR" : "SAVE"}
                </button>
              </div>
            </div>
          ) : null}
          {this.state.hasInsurance === false ? (
            <div className="row text-center">
              <div className="col-md-12">
                <p className="disable-msg">
                  Please get in touch with a wedding representative to get
                  assistance regarding your travel.
                </p>
              </div>
              <div className="col-md-12">
                <button
                  className="myInformationBtn btnSave"
                  onClick={() => {
                    browserHistory.push("/contactUs");
                  }}
                >
                  go to contact us page
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Insurance;
