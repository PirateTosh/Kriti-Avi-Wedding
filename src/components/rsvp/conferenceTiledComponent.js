import React, { Component } from "react";
import { browserHistory } from "react-router";
import _ from "lodash";

export default class ConferenceTiledComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateDataToRSVP = this.updateDataToRSVP.bind(this);
  }

  updateDataToRSVP(e) {
    this.props.updateData(e.target);
  }

  render() {
    const {
      title,
      accordion,
      collapse,
      eventsArray,
      eventsArrayStatus,
      updateData,
      eventsIdArray
    } = this.props;

    if (eventsArray) {
      var evt = Object.keys(eventsArray).map((data, i) => {
        let evStatus = eventsArrayStatus && eventsArrayStatus[data];
        return (
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="col-md-8 col-sm-8 offset-md-2 offset-sm-2">
                <h5>{data}</h5>
                {eventsArray[data].map((internalData, i) => {
                  let isActive = "no-active";
                  let subEventId =
                    eventsIdArray &&
                    eventsIdArray[data] &&
                    eventsIdArray[data][i]
                      ? eventsIdArray[data][i]
                      : "";
                  if (title === "ATTENDING" && evStatus[i] === true) {
                    isActive = "active";
                  } else if (
                    title === "NOT ATTENDING" &&
                    evStatus[i] === false
                  ) {
                    isActive = "active";
                  } else if (title === "MAYBE" && evStatus[i] === "Maybe") {
                    isActive = "active";
                  }

                  return (
                    <button
                      key={i}
                      data-type={title}
                      data-subeventId={subEventId}
                      data-name={internalData}
                      className={`btn commonBtnDestination appBodyFontFamily appBodyFontColor rsvpMargin rsvp-btn ${isActive}`}
                      onClick={this.updateDataToRSVP}
                    >
                      {internalData}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      });
    }
    return (
      <div className="container rsvpRowWidth">
        <div className="row attending-collapse">
          <div className="col-md-1" />
          <div className="col-md-10">
            <div id={accordion} className="accordion">
              <div className="card myPreference-card mb-0">
                <div
                  className="card-header text-center card-header-rsvp appGradientColor collapsed"
                  data-toggle="collapse"
                  href={"#" + collapse}
                  rel={title}
                >
                  <a className="card-title appBodyFontFamily mainheadingCommon appBodyFontColor">
                    {title}
                  </a>
                </div>
                <div
                  id={collapse}
                  className="card-body myPreference-card-body appGradientColor collapse"
                  data-parent={"#" + accordion}
                >
                  <div className="collapseBodyParagraphp appBodyFontColor appBodyFontFamily">
                    <p className="tapToSelect">(Tap to select)</p>

                    {evt}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1" />
        </div>
      </div>
    );
  }
}
