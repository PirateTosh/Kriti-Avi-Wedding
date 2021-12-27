import React, { Fragment } from "react";

import TNC from "../../molecules/tnc";
import GuestSelect from "../../molecules/guestSelect";

class Packages extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      family,
      packages,
      eventDetails,
      onPackageSelect,
      guestPackageMapping = {}
    } = this.props;

    return (
      <div id="accordionPackages" className="accordion">
        <div>
          {packages &&
            packages.length &&
            packages.map(p => {
              if (p.packageType.toLowerCase() !== "main") {
                return;
              }
              return (
                <Fragment key={p._id}>
                  <div
                    className="card-header card-header-customized appGradientColor appBodyFontFamily collapsed"
                    data-toggle="collapse"
                    href={`#${p._id}`}
                  >
                    <a className="card-title">
                      {" "}
                      <i className="fa fa-ticket" aria-hidden="true" />
                      {p.packageName}{" "}
                    </a>
                  </div>
                  <div
                    id={p._id}
                    className="card-body myPreference-card-body appGradientColor appBodyFontFamily collapse appBodyFontColor"
                    data-parent="#accordionPackages"
                  >
                    <p className="font-weight-bold">
                      Price: {p.packagePrice} + (GST {p.packageGst}%)
                    </p>
                    <p className="font-weight-bold">Description</p>
                    <p>{p.description}</p>
                    {eventDetails && eventDetails.terms && (
                      <TNC id={p._id} terms={eventDetails.terms} />
                    )}
                    <div>
                      <div className="row">
                        <div className="col-12 text-center mb-3">
                          <span className="headingPurchase headingTopMobile appBodyFontColor appBodyFontFamily">
                            Select this package
                          </span>
                        </div>
                        <div className="col-12 text-center">
                          <GuestSelect
                            family={family}
                            selected={guestPackageMapping[p._id]}
                            onChange={(guestId, isChecked) =>
                              onPackageSelect({
                                packageId: p._id,
                                type: p.packageType.toLowerCase(),
                                guestId,
                                isChecked
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="row text-center mt-3">
                        {guestPackageMapping[p._id] &&
                          guestPackageMapping[p._id].length > 0 && (
                            <div className="col-12">
                              Your changes has been updated to cart
                            </div>
                          )}
                        {/* {(guestPackageMapping[p._id] && guestPackageMapping[p._id].length > 0) && (
                          <div className="col-12">
                            <button onClick>Add to Cart</button>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                </Fragment>
              );
            })}
        </div>
      </div>
    );
  }
}

export default Packages;
