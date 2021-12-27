import React, { Component } from "react";
import { browserHistory } from "react-router";
import { format } from "date-fns";

class Checkout extends Component {
  generateRow = (pkg, guests, key) => {
    const { family, calculatePriceWithTax } = this.props;
    return (
      <React.Fragment key={key}>
        {guests.map(gId => {
          const m = family.find(guest => guest._id === gId);
          return (
            <tr key={gId}>
              <td>
                {" "}
                <p className="title">{pkg.packageName}</p>
              </td>
              <td>
                <p>1</p>
              </td>
              <td>
                <p>
                  {m.guestFirstName} {m.guestLastName}
                </p>
              </td>
              <td>
                <p>
                  <i class="fa fa-inr" aria-hidden="true" /> {pkg.packagePrice}{" "}
                  + (GST {pkg.packageGst} %)
                </p>
              </td>
              <td>
                <p>
                  <i class="fa fa-inr" aria-hidden="true" />{" "}
                  {parseFloat(calculatePriceWithTax(pkg, 1))}
                </p>
              </td>
            </tr>
          );
        })}
      </React.Fragment>
    );
  };
  render() {
    const {
      packages,
      guestPackages,
      guestAdditionalPackages,
      cartTotal,
      paymentResponse
    } = this.props;
    return (
      <div className="container">
        <div className="row mT90">
          <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily">
            Summary
          </h3>
        </div>
        <div className="row">
          <div className="mx-auto">
            <p className="text-center appBodyFontFamily appBodyFontColor">
              Thank you for your order
            </p>
          </div>
        </div>

        <div className="row px-2">
          <div className="mx-auto">
            <p className="appBodyFontFamily appBodyFontColor ">
              Order ID: {paymentResponse.orderId}
            </p>
            <p className="appBodyFontFamily appBodyFontColor">
              Date: {format(paymentResponse.createdAt, "MMM, DD YYYY")}
            </p>
            <div
              id="myCart"
              className="appGradientColor appBodyFontFamily appBodyFontColor"
            >
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Package Name</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Guests</th>
                    <th scope="col">Price</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(guestPackages).map(key => {
                    const pkg = packages.find(p => p._id === key);

                    return this.generateRow(pkg, guestPackages[key], key);
                  })}
                  {Object.keys(guestAdditionalPackages).map(key => {
                    const pkg = packages.find(p => p._id === key);
                    return this.generateRow(
                      pkg,
                      guestAdditionalPackages[key],
                      key
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td scope="col" colSpan="4">
                      Grand Total
                    </td>
                    <td scope="col">{cartTotal}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div className="row mx-auto m-4">
          <div className="updateBtn">
            <button onClick={() => browserHistory.push("/")}>Go to Home</button>
          </div>
        </div>
      </div>
    );
  }
}
export default Checkout;
