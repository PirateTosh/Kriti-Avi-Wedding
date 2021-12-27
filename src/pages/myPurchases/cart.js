import React, { Component } from "react";
import { browserHistory } from "react-router";

class Cart extends Component {
  generateRow = (pkg, guests, key) => {
    const { family, onPackageSelect } = this.props;
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
                <i
                  class="fa fa-trash"
                  aria-hidden="true"
                  onClick={() => {
                    onPackageSelect({
                      packageId: pkg._id,
                      type: pkg.packageType.toLowerCase(),
                      gId,
                      isChecked: false
                    });
                  }}
                />
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
      goBack,
      checkoutCart,
      loading
    } = this.props;

    return (
      <div className="container">
        {/* <div className="row mT90"></div> */}
        <div className="row mT90">
          <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily">
            CART <i class="fa fa-shopping-cart" aria-hidden="true" />
          </h3>
          {/* <div className="updateBtn" style={{ marginTop: '90px' }}>
                        <button>CART  <i class="fa fa-shopping-cart" aria-hidden="true"></i></button>
                    </div> */}
        </div>
        <div className="row">
          <div className="mx-auto">
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
                    <th scope="col">Total</th>
                    <th scope="col" />
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
                  <tr>
                    <td colSpan="5" className="text-center font-weight-bold">
                      <p>
                        Grand Total <i class="fa fa-inr" aria-hidden="true" />{" "}
                        {cartTotal}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="row mx-auto m-4">
          <div className="updateBtn">
            <button onClick={() => goBack()} disabled={loading}>
              Back
            </button>
          </div>
          <div className="updateBtn">
            <button onClick={() => checkoutCart()} disabled={loading}>
              Checkout <i class="fa fa-arrow-right" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Cart;
