import React from "react";
import Popup from "react-popup";
import { CLIENT_RENEG_LIMIT } from "tls";

class MyPurchase extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  displayPackageDetails(e, sp, orderId) {
    e.preventDefault();
    const { myPurchases } = this.props;
    const orderDetails = myPurchases.filter(pkg => pkg.orderId === orderId);
    let orderSummary = "Order Summary\n_________________\n";
    orderDetails[0].guestsInfo.map(guest => {
      orderSummary += `${guest.title} ${guest.fname} ${guest.lname}\n`;
    });
    orderSummary += `\n ${sp.description}`;
    Popup.alert(orderSummary);
  }

  render() {
    const { myPurchases, family } = this.props;
    const myOrder = myPurchases && myPurchases.length > 0 ? true : false;
    return (
      <React.Fragment>
        {myOrder ? (
          <div id="accordion" className="accordion">
            <div>
              <div
                className="card-header card-header-customized appGradientColor appBodyFontFamily collapsed"
                data-toggle="collapse"
                href="#myPurchases"
              >
                <a className="card-title">
                  {" "}
                  <i className="fa fa-ticket" aria-hidden="true" />
                  My Purchases
                </a>
              </div>
            </div>
            <div
              id="myPurchases"
              className="card-body myPreference-card-body appGradientColor appBodyFontFamily collapse appBodyFontColor"
              data-parent="#accordion"
            >
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Order Id</th>
                    <th scope="col">Package Name</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {myPurchases.map(pkg => {
                    if (!pkg.guestPackagesMap) {
                      return null;
                    }
                    // return pkg.guestPackagesMap.map(gp => {
                    return Object.keys(pkg.guestPackagesMap).map(key => {
                      const sp = pkg.selectedPackages.find(p => p._id === key);
                      return (
                        <tr key={key}>
                          <th scope="row">{pkg.orderId}</th>
                          <td>
                            {" "}
                            <p className="title">{sp.packageName}</p>
                          </td>
                          <td>
                            <p>{pkg.guestPackagesMap[key].length}</p>
                          </td>
                          <td>
                            <a
                              onClick={e =>
                                this.displayPackageDetails(e, sp, pkg.orderId)
                              }
                            >
                              <i class="fa fa-info-circle" aria-hidden="true" />
                            </a>
                          </td>
                        </tr>
                      );
                    });
                    // });
                  })}
                  {myPurchases.map(pkg => {
                    if (!pkg.guestAdditionalPackagesMap) {
                      return null;
                    }
                    // return pkg.guestAdditionalPackagesMap.map(gp => {
                    return Object.keys(pkg.guestAdditionalPackagesMap).map(
                      key => {
                        const sp = pkg.selectedPackages.find(
                          p => p._id === key
                        );
                        return (
                          <tr key={key}>
                            <th scope="row">{pkg.orderId}</th>
                            <td>
                              {" "}
                              <p className="title">{sp.packageName}</p>
                            </td>
                            <td>
                              <p>
                                {pkg.guestAdditionalPackagesMap[key].length}
                              </p>
                            </td>
                            <td>
                              <a
                                onClick={e =>
                                  this.displayPackageDetails(e, sp, pkg.orderId)
                                }
                              >
                                <i
                                  class="fa fa-info-circle"
                                  aria-hidden="true"
                                />
                              </a>
                            </td>
                          </tr>
                        );
                      }
                    );
                    // });
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default MyPurchase;
