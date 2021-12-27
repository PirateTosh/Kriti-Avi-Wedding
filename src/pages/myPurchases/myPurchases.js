import React, { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";
// import { browserHistory } from "react-router";

import Packages from "./organism/packages";
import MyPurchase from "./organism/myPurchase";
import AdditionalPackages from "./organism/additionalPackages";

import Cart from "./cart";
import Checkout from "./checkout";

import { PAY_CONFIG } from "./paymentConfig";

import {
  getPackages,
  getFamilyMembers,
  getMyPurchases,
  getPackageEventDetails
} from "./stateSelector";
import {
  fetchFamilyMembers,
  fetchPackages,
  createTicketLog,
  updateTicketLog,
  fetchPackageEventDetails,
  fetchMyPurchases
} from "../../api/packages";

const calculatePriceWithTax = (pkg, count) => {
  const price = parseFloat(pkg.packagePrice) * count;
  const tax = parseFloat(pkg.packageGst);
  return Number(price + (price * tax) / 100).toFixed(2);
};

class MyPurchases extends Component {
  constructor(props) {
    super(props);
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    this.state = {
      show: false,
      guestId:
        isLoggedIn == "true" ? window.localStorage.getItem("guestId") : null,
      guestName:
        isLoggedIn == "true"
          ? `${window.localStorage.getItem(
              "guestFirstName"
            )} ${window.localStorage.getItem("guestLastName")}`
          : null,
      guestPackages: {},
      guestAdditionalPackages: {},
      showCheckoutOption: "",
      cartTotal: 0,
      isCartPage: false,
      loading: false,
      selectedPackages: [],
      guestIds: [],
      prePaymentResponse: {},
      isSummaryPage: false,
      isPaymentPending: false
    };
  }

  componentDidMount() {
    const { guestId } = this.state;
    fetchFamilyMembers(guestId);
    fetchPackageEventDetails();
    fetchMyPurchases(guestId);
    fetchPackages();
  }

  showModal = () => this.setState({ show: true });
  hideModal = () => this.setState({ show: false });

  onPackageSelect = data => {
    const { guestPackages, guestAdditionalPackages } = this.state;
    if (data.type === "main") {
      const arr = guestPackages[data.packageId]
        ? [...guestPackages[data.packageId]]
        : [];
      data.isChecked
        ? arr.push(data.guestId)
        : arr.splice(arr.indexOf(data.guestId), 1);
      this.setState(
        {
          guestPackages: {
            ...guestPackages,
            [data.packageId]: [...arr]
          }
        },
        () => this.updateCheckoutStatus()
      );
    } else if (data.type === "additional") {
      const arr = guestAdditionalPackages[data.packageId]
        ? [...guestAdditionalPackages[data.packageId]]
        : [];
      data.isChecked
        ? arr.push(data.guestId)
        : arr.splice(arr.indexOf(data.guestId), 1);

      this.setState(
        {
          guestAdditionalPackages: {
            ...guestAdditionalPackages,
            [data.packageId]: [...arr]
          }
        },
        () => this.updateCheckoutStatus()
      );
    }
  };

  updateCheckoutStatus = () => {
    const { packages } = this.props;
    const { guestPackages, guestAdditionalPackages, cartTotal } = this.state;
    let total = 0;

    const allPackages = { ...guestPackages, ...guestAdditionalPackages };
    let showCheckoutOption = false;
    const selectedPackages = [];
    let guestIds = [];

    Object.keys(allPackages).forEach(key => {
      const pkg = packages.find(p => p._id === key);
      if (allPackages[key].length) {
        selectedPackages.push({ ...pkg });
        showCheckoutOption = allPackages[key].length;
        total =
          parseFloat(calculatePriceWithTax(pkg, allPackages[key].length)) +
          parseFloat(total);
        guestIds = [...guestIds, ...allPackages[key]];
      }
    });
    this.setState({
      showCheckoutOption,
      cartTotal: total,
      selectedPackages,
      guestIds: [...new Set(guestIds)]
    });
  };

  viewCart = () => {
    this.setState({ isCartPage: true });
  };

  checkoutCart = () => {
    const { family } = this.props;
    const { guestId, guestIds } = this.state;
    // const buyerInfo = family.find(gId => gId === guestId);

    const buyerObj = family.find(guest => guest.guestId === guestId);

    const buyerInfo = {
      guestId: buyerObj._id,
      title: buyerObj.guestTitle,
      fname: buyerObj.guestFirstName,
      lname: buyerObj.guestLastName,
      email: buyerObj.guestPersonalEmail,
      phone: buyerObj.guestContactNo,
      countryCode: buyerObj.guestPhoneCode
    };

    const guestsInfo = [];
    family.forEach(m => {
      if (guestIds.includes(m._id)) {
        guestsInfo.push({
          guestId: m._id,
          title: m.guestTitle,
          fname: m.guestFirstName,
          lname: m.guestLastName,
          email: m.guestPersonalEmail,
          phone: m.guestContactNo,
          countryCode: m.guestPhoneCode
        });
      }
    });

    this.enablePayment(buyerInfo);
    this.proceedPayment(buyerInfo, guestsInfo);
  };

  enablePayment = buyerInfo => {
    const { cartTotal } = this.state;
    PAY_CONFIG.amount = cartTotal * 100;

    if (PAY_CONFIG.amount > 0) {
      PAY_CONFIG.prefill = {
        name: `${buyerInfo.fname} ${buyerInfo.lname}`,
        email: buyerInfo.email,
        contact: `${buyerInfo.countryCode} ${buyerInfo.phone}`
      };
      PAY_CONFIG.handler = this.postPayment.bind(this);
      PAY_CONFIG.modal = {
        ondismiss: this.onPaymentDismis.bind(this)
      };

      this.rzp1 = new window["Razorpay"](PAY_CONFIG);
    }
  };

  proceedPayment = (buyerInfo, guestsInfo) => {
    const { eventDetails } = this.props;
    const {
      selectedPackages,
      cartTotal,
      isPaymentPending,
      guestId,
      guestPackages,
      guestAdditionalPackages
    } = this.state;

    if (isPaymentPending) {
      this.rzp1.open();
      return;
    }

    this.setState({ loading: true }, () => {
      const payload = {
        eventId: eventDetails.eventId,
        selectedPackages: selectedPackages,
        guestPackagesMap: guestPackages,
        guestAdditionalPackagesMap: guestAdditionalPackages,
        buyerInfo,
        guestsInfo,
        buyerId: guestId,
        payment: {
          totalAmout: cartTotal,
          paymentDetails: null
        }
      };

      createTicketLog(payload, res => {
        if (res && !res.error) {
          this.setState({ isPaymentPending: true, prePaymentResponse: res });
          if (cartTotal > 0) {
            this.rzp1.open();
          } else {
            this.onSuccessRedirect(res);
          }
        } else {
          this.onFail(res.error);
        }
      });
    });
  };

  onPaymentDismis() {
    this.setState({ loading: false });
  }

  postPayment(response) {
    const { prePaymentResponse } = this.state;
    const payload = {
      id: prePaymentResponse._id,
      paymentDetails: response
    };

    updateTicketLog(payload, res => {
      if (res && !res.error) {
        this.onSuccessRedirect(res);
      } else {
        this.onFail(res.error);
      }
    });
  }

  onSuccessRedirect = res => {
    this.setState({ isSummaryPage: true });
  };

  onFail = error => {
    alert(error);
    this.setState({ loading: false });
  };

  render() {
    $(".backIcon").show();
    $(".backIconMobile").show();
    $("#spanHeaderText").html("Spl Packages");
    const { family, packages, eventDetails, myPurchases } = this.props;
    const {
      guestPackages,
      guestAdditionalPackages,
      showCheckoutOption,
      isCartPage,
      cartTotal,
      loading,
      isSummaryPage,
      prePaymentResponse
    } = this.state;
    const additionalCount = packages.filter(p => p.packageType === "additional")
      .length;

    if (isSummaryPage) {
      return (
        <Checkout
          paymentResponse={prePaymentResponse}
          packages={packages}
          guestPackages={guestPackages}
          guestAdditionalPackages={guestAdditionalPackages}
          family={family}
          cartTotal={cartTotal}
          loading={loading}
          calculatePriceWithTax={calculatePriceWithTax}
        />
      );
    }

    return (
      <React.Fragment>
        {!isCartPage ? (
          <div className="container">
            <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block">
              MY PURCHASES
            </h3>
            <div className="row mT90" />
            <div className="row mT90">
              <div className="col-md-8 mx-auto">
                <MyPurchase myPurchases={myPurchases} family={family} />
              </div>
            </div>
            <h3 className="headingPurchase headingTopMobile appBodyFontColor appBodyFontFamily">
              Buy New Packages
            </h3>
            <div className="row">
              <div className="col-md-8 mx-auto">
                <Packages
                  family={family}
                  packages={packages}
                  eventDetails={eventDetails}
                  onPackageSelect={data => this.onPackageSelect(data)}
                  guestPackageMapping={guestPackages}
                />
              </div>
            </div>
            {/* Additiona Package Start */}
            {additionalCount && (
              <React.Fragment>
                <h3 className="headingPurchase headingTopMobile appBodyFontColor appBodyFontFamily">
                  Buy Additional Packages
                </h3>
                <div className="row">
                  <div className="col-md-8 mx-auto">
                    <AdditionalPackages
                      family={family}
                      packages={packages}
                      eventDetails={eventDetails}
                      onPackageSelect={data => this.onPackageSelect(data)}
                      guestPackageMapping={guestAdditionalPackages}
                    />
                  </div>
                </div>
              </React.Fragment>
            )}
            {/* Additiona Package End */}
            {showCheckoutOption && (
              <div className="row mx-auto m-4">
                {/* <div className="col-12">
              <p className="text-center appBodyFontFamily appBodyFontColor">
                [*below buttons visible only when item in cart]
              </p>
            </div> */}

                <div className="updateBtn">
                  <button onClick={() => this.viewCart()} disabled={loading}>
                    View Cart{" "}
                    <i class="fa fa-shopping-cart" aria-hidden="true" />
                  </button>
                </div>
                {/* <div className="updateBtn">
                  <button onClick={() => this.viewCart()} disabled={loading}>
                    CHECKOUT <i class="fa fa-arrow-right" aria-hidden="true" />
                  </button>
                </div> */}
              </div>
            )}
          </div>
        ) : (
          <Cart
            packages={packages}
            guestPackages={guestPackages}
            guestAdditionalPackages={guestAdditionalPackages}
            family={family}
            onPackageSelect={data => this.onPackageSelect(data)}
            cartTotal={cartTotal}
            goBack={() => this.setState({ isCartPage: false })}
            checkoutCart={() => this.checkoutCart()}
            loading={loading}
          />
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    eventDetails: getPackageEventDetails(state),
    packages: getPackages(state),
    family: getFamilyMembers(state),
    myPurchases: getMyPurchases(state)
  };
}

export default connect(mapStateToProps)(MyPurchases);
