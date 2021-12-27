import React, { Fragment } from "react";
import { connect } from "react-redux";
import { browserHistory } from "react-router";

import _ from "lodash";

import { getFeaturedPhotos, getGuestSharedPhotos, getSettings } from "../../stateSelector";
import {
  fetchFeaturedPhotos,
  fetchPhotos,
  sharePhoto
} from "../../../../api/photoShared";

import store from "../../../../store";
import { uploadPhoto } from "../../../../api/guestInformationApi.js";
import { dataSavedSuccessfully } from "../../../../actions/popup.action";
import { PHOTOS } from "../../../../constants";

import { PhotoPage, PageContent } from "./Home.styles";

import Header from "../../molecules/Header";
import AddIcon from "../../atoms/AddIcon";
import Grid from "../../molecules/Grid";
import ImageWithoutCropper from "../..//organism/ImageWithoutCropper";

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    this.state = {
      featured: props.featured,
      guestShared: props.guestShared,
      gridLayout: 3,
      files: null,
      guestId: isLoggedIn == 'true' ? window.localStorage.getItem("guestId") : null,
      guestName:
        isLoggedIn == 'true'
          ? `${window.localStorage.getItem("guestFirstName")} ${window.localStorage.getItem("guestLastName")}`
          : null
    };
  }
  componentDidMount() {
    const {
      params: { subPath }
    } = this.props;
    if (!subPath || PHOTOS.SUB_PATH[subPath.toUpperCase()]) {
      subPath
        ? fetchPhotos(subPath, this.state.guestId)
        : fetchFeaturedPhotos();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.params.subPath !== nextProps.params.subPath) {
      this.setState({ files: null });
      nextProps.params.subPath
        ? fetchPhotos(nextProps.params.subPath, this.state.guestId)
        : fetchFeaturedPhotos();
    }
  }

  processPhoto(data, files) {
    const image = files[0];
    uploadPhoto(image)
      .then(url => {
        const payload = {
          createdBy: this.state.guestId,
          url,
          featured: false,
          sticky: false,
          status: "published",
          ...data
        };
        sharePhoto(payload).then(res => {
          this.setState({ files: null }, () => {
            browserHistory.push(
              `/${PHOTOS.BASE_PATH}/${PHOTOS.SUB_PATH.GUESTS}`
            );
          });
          store.dispatch(
            dataSavedSuccessfully("Photo uploaded successfully", res)
          );
        });
      })
      .catch(e => {
        alert(e, "Upload failed");
      });
  }

  onFileSelect(e) {
    if (e.target.files) {
      this.setState({ files: e.target.files });
    }
  }

  renderRedirect = () => {
    const {
      params: { subPath }
    } = this.props;
    if (subPath && !PHOTOS.SUB_PATH[subPath.toUpperCase()]) {
      return browserHistory.push("/");
    }
  };
  render() {
    return (
      <PhotoPage className="appBodyFontFamily appBodyFontColor">
        {this.renderRedirect()}
        <PageContent>
          {this.state.files ? (
            <ImageWithoutCropper
              guestId={this.state.guestId}
              files={this.state.files}
              uploadPhoto={(data, files) => this.processPhoto(data, files)}
              cancelUpload={() => this.setState({files: null })}
            />
          ) : (
            <Fragment>
              <Header
                {...this.props}
                changeLayout={value => this.setState({ gridLayout: value })}
                column={this.state.gridLayout}
                guestId={this.state.guestId}
              />
              <Grid
                items={
                  this.props.params.subPath
                    ? this.props.guestShared
                    : this.props.featured
                }
                column={this.state.gridLayout}
              />
              {this.state.guestId && <AddIcon onFileSelection={e => this.onFileSelect(e)} />}
            </Fragment>
          )}
        </PageContent>
      </PhotoPage>
    );
  }
}

function mapStateToProps(state) {
  return {
    featured: getFeaturedPhotos(state),
    guestShared: getGuestSharedPhotos(state),
    photoShareSetting: getSettings(state)
  };
}

export default connect(mapStateToProps)(Home);
