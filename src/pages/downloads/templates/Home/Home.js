import React, { Fragment } from "react";
import { connect } from "react-redux";
import $ from "jquery";

import _ from "lodash";

import { getDownloads } from "../../stateSelector";
import { fetchDownloads } from "../../../../api/downloads";

import { DownloadPage, DownloadContent } from "./Home.styles";

import Grid from "../../molecules/Grid";

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    this.state = {
      downloads: props.downloads,
      guestId:
        isLoggedIn == "true" ? window.localStorage.getItem("guestId") : null,
      guestName:
        isLoggedIn == "true"
          ? `${window.localStorage.getItem(
              "guestFirstName"
            )} ${window.localStorage.getItem("guestLastName")}`
          : null
    };
  }
  componentDidMount() {
    fetchDownloads(this.state.guestId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.downloads !== nextProps.downloads) {
      this.setState({ downloads: nextProps.downloads });
    }
  }

  render() {
    $(".backIcon").show();
    $(".backIconMobile").show();
    $("#spanHeaderText").html("E-DOCS");
    const { guestName, downloads } = this.state;

    return (
      <DownloadPage className="appBodyFontFamily mx-auto appBodyFontColor">
        <DownloadContent>
          <div className="container">
            <div className="row mT90 mb-3">
              <div className="myPassportBtnTop">
                <div className="BtnCommon responsiveBtn  rsvpWeddingGuestName">
                  <button
                    className={`btn commonBtnDestination appBodyFontColor  appBodyFontFamily active`}
                  >
                    {guestName}
                  </button>
                </div>
              </div>
            </div>
            {downloads && downloads.length == 0 && (
              <div className="appBodyFontColor appBodyFontFamily">
                <div className="row">
                  <div className="mx-auto mT90">
                    <h6>No documents to view</h6>
                  </div>
                </div>
              </div>
            )}
            {downloads &&
              downloads.map(section => {
                return (
                  <div className="container" key={section._id}>
                    <div className="row attending-collapse">
                      <div className="col-md-12">
                        <div id={`parent_${section._id}`} className="accordion">
                          <div className="card myPreference-card my-2">
                            <div
                              className="card-header card-header-rsvp appGradientColor collapsed"
                              data-toggle="collapse"
                              href={"#" + section._id}
                            >
                              <a className="card-title appBodyFontFamily mainheadingCommon appBodyFontColor">
                                <i className="fa fa-download icon-white" />
                                {section.name}
                              </a>
                            </div>
                            <div
                              id={section._id}
                              className="card-body myPreference-card-body appGradientColor collapse"
                              data-parent={"#" + `parent_${section._id}`}
                            >
                              <div className="collapseBodyParagraphp appBodyFontColor appBodyFontFamily">
                                <div class="row">
                                  {/* Display all downloadable files which belongs to any subSection*/}
                                  {section.sections.map(subSection => {
                                    return section.records.map(item => {
                                      return subSection._id ===
                                        item.subSectionId ? (
                                        <div className="col-12 text-center">
                                          {subSection.name && (
                                            <h5>{subSection.name}</h5>
                                          )}
                                          <a
                                            href={item.url}
                                            target="_blank"
                                            className="btn commonBtnDestination appBodyFontFamily appBodyFontColor rsvpMargin rsvp-btn"
                                          >
                                            <i
                                              className="fa fa-file-pdf-o mr-2"
                                              aria-hidden="true"
                                            />
                                            DOWNLOAD
                                          </a>
                                        </div>
                                      ) : null;
                                    });
                                  })}
                                  {/* Display all downloadable files which not belongs to andy subSection*/}
                                  {section.records.map(item => {
                                    return !item.subSectionId ? (
                                      <div className="col-12 text-center">
                                        <p>{section.description}</p>
                                        <a
                                          href={item.url}
                                          target="_blank"
                                          className="btn commonBtnDestination appBodyFontFamily appBodyFontColor rsvpMargin rsvp-btn"
                                        >
                                          <i
                                            className="fa fa-file-pdf-o mr-2"
                                            aria-hidden="true"
                                          />
                                          DOWNLOAD
                                        </a>
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </DownloadContent>
      </DownloadPage>
    );
  }
}

function mapStateToProps(state) {
  return {
    downloads: getDownloads(state)
  };
}

export default connect(mapStateToProps)(Home);
