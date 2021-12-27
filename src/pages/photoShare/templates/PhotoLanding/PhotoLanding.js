import React, { Fragment } from "react";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import _ from "lodash";

import { getPhotoDetail, getSettings, getImageDownloadDetail } from "../../stateSelector";
import {
  fetchPhotoDetail,
  fetchSettings,
  fetchImageDownloadDetails,
  likeDislikePhoto,
  deletePhoto
} from "../../../../api/photoShared";

import { PHOTOS } from "../../../../constants";

import {
  PhotoPage,
  PageContent,
  PhotoWrapper,
  CaptionWrapper,
  ActionElements,
  SSlist,
  SocialStyle
} from "./PhotoLanding.styles";

import Header from "../../molecules/Header";
import ImageTag from "../../../../common/atoms/Image";
import Comments from "../../organism/Comments";
import Likes from "../../organism/Likes";

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  EmailShareButton,
} from 'react-share';
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,  
  PinterestIcon,
  EmailIcon,
} from 'react-share';

class PhotoLanding extends React.PureComponent {
  constructor(props) {
    super(props);
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    this.state = {
      downloadImage: "",
      base64: '',
      showDeleteDialog: false,
      isCommentScreen: false,
      photoDetail: {},
      guestId:
        isLoggedIn == "true" ? window.localStorage.getItem("guestId") : null,
      guestName:
        isLoggedIn == "true"
          ? window.localStorage.getItem("guestFirstName") +
            window.localStorage.getItem("guestLastName")
          : null
    };
  }
  componentDidMount() {
    const {
      params: { photoId, subPath }
    } = this.props;
    if (subPath && !PHOTOS.LANDING_SUB_PATH[subPath.toUpperCase()]) {
      browserHistory.push(`/${PHOTOS.BASE_PATH}`);
    } else {
      fetchPhotoDetail(photoId, this.state.guestId);
      if (this.state.guestId) {
        fetchSettings();
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      !this.state.showDeleteDialog &&
      this.props.params.photoId !== nextProps.params.photoId
    ) {
      fetchPhotoDetail(nextProps.params.photoId, this.state.guestId);
    } else if (nextProps.photoDetail !== this.props.photoDetail) {
      this.setState(
        {
          base64: '',
          isCommentScreen: false,
          photoDetail: nextProps.photoDetail
        },
        () => {
          fetchImageDownloadDetails(this.state.photoDetail.photo.url);
        }
      );
    }else if(this.props.photoShareSetting.length && this.props.photoShareSetting[0].download && nextProps.base64 !== this.props.base64){
      this.setState({
        base64: nextProps.base64
      },()=>{
      this.readyDownloadImage();
      });
    }
  }

  userAction(event, type) {
    if(event.type==='click' && type==='share') {
      var e = document.getElementById('socialShare');
      if(e.style.display == 'block') {
        e.style.display = 'none';
      } else {
        e.style.display = 'block'
      }
    }
  }

  likeOrDislikePhoto() {
    likeDislikePhoto(
      this.state.photoDetail.photo._id,
      this.state.guestId,
      (err, res) => {
        this.setState({
          isCommentScreen: false,
          photoDetail: {
            ...this.state.photoDetail,
            youLiked: res,
            likedCount: this.state.photoDetail.likedCount + (res ? 1 : -1)
          }
        });
      }
    );
  }
  deletePhotoConfirm() {
    deletePhoto(
      this.state.photoDetail.photo._id,
      this.state.guestId,
      (err, res) => {
        if (res) {
          browserHistory.push(
            `/${PHOTOS.BASE_PATH}/${PHOTOS.SUB_PATH.SHAREDBYME}`
          );
        }
      }
    );
  }

  switchScreen(type) {
    switch (type) {
      case PHOTOS.LANDING_SUB_PATH.COMMENTS: {
        browserHistory.push(
          `/${PHOTOS.LANDING}/${this.state.photoDetail.photo._id}/${
            PHOTOS.LANDING_SUB_PATH.COMMENTS
          }`
        );
        break;
      }
      case PHOTOS.LANDING_SUB_PATH.LIKES: {
        browserHistory.push(
          `/${PHOTOS.LANDING}/${this.state.photoDetail.photo._id}/${
            PHOTOS.LANDING_SUB_PATH.LIKES
          }`
        );
        break;
      }
      default:
        break;
    }
  }

  readyDownloadImage() {
    if (this.state.base64) {
      const _self = this;
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = this.state.base64;
      const fileName = this.state.photoDetail.photo.url.split(/(\\|\/)/g).pop();
      image.onload = function() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.canvas.width = image.width;
        ctx.canvas.height = image.height;
        ctx.drawImage(this, 0, 0);
        const blob = canvas.toDataURL("image/jpeg");
        _self.setState({ downloadImage: blob, downloadFileName: fileName });
      };
    }
  }

  render() {
    const {
      photoShareSetting,
      params: { subPath, commentId }
    } = this.props;
    const { photoDetail, showDeleteDialog, base64 } = this.state;

    const hostName = photoDetail.createdBy
      ? `${photoDetail.createdBy.guestFirstName} ${
          photoDetail.createdBy.guestLastName
        }`
      : photoShareSetting.length
      ? photoShareSetting[0].host
      : "Host";

    return (
      <PhotoPage className="appBodyFontFamily appBodyFontColor appGradientColor">
        <PageContent>
          {!subPath && (
            <Fragment>
              <PhotoWrapper>
                {photoDetail && photoDetail.photo ? (
                  <Fragment>
                    <figure className="figure figure1">
                      <ImageTag
                        alt={photoDetail.photo.caption}
                        src={photoDetail.photo.url}
                        className="figure-img img-fluid img-responsive"
                      />
                      <figcaption className="figure-caption">
                        <h5 className="pull-right m-0">
                          <span className="badge badge-warning">
                            {photoDetail.groupDetails
                              ? photoDetail.groupDetails.groupName
                              : "Public"}
                          </span>
                        </h5>
                        <p className="appBodyFontColor paragraphCommon lineFormat d-flex justify-content-start align-items-center">
                          <span className="thumb align-self-star">
                            {hostName.charAt(0)}
                          </span>
                          <span>{hostName}</span>
                        </p>
                      </figcaption>
                    </figure>

                    {photoShareSetting && photoShareSetting.length ? (
                      <CaptionWrapper className="invitationMessage">
                        <ActionElements>
                          {photoShareSetting[0].like && (
                            <li>
                              <span
                                title="Like"
                                className={`fa ${
                                  photoDetail.youLiked
                                    ? "fa-heart"
                                    : "fa-heart-o"
                                }`}
                                onClick={() => this.likeOrDislikePhoto()}
                              />
                            </li>
                          )}
                          {photoShareSetting[0].share && (
                            <li>
                              <span
                                title="Share"
                                className="fa fa-share-alt"
                                onClick={e => this.userAction(e, "share")}
                              />
                            </li>
                          )}
                          {photoShareSetting[0].comment && (
                            <li>
                              <span
                                title="Comment"
                                className="fa fa-comments-o"
                                onClick={e =>
                                  this.switchScreen(
                                    PHOTOS.LANDING_SUB_PATH.COMMENTS
                                  )
                                }
                              />
                            </li>
                          )}
                          {base64 && (
                            <li>
                              <a
                                href={this.state.downloadImage}
                                download={this.state.downloadFileName}
                                title="Download"
                                className="appBodyFontColor fa fa-download"
                              />
                            </li>
                          )}
                          {photoDetail.createdBy &&
                            photoDetail.createdBy._id ===
                              this.state.guestId && (
                              <li>
                                <span
                                  title="Delete"
                                  className="fa fa-trash"
                                  onClick={() =>
                                    this.setState({ showDeleteDialog: true })
                                  }
                                />
                              </li>
                            )}
                        </ActionElements>
                        <SocialStyle id="socialShare" className="socialShare">
                                  <SSlist className="socialShareList">
                                    <li className="socialShareListItem">
                                      <FacebookShareButton url={photoDetail.photo.url} quote={photoDetail.photo.caption}>
                                      <FacebookIcon size={32} round={true} />
                                      </FacebookShareButton>
                                    </li>
                                    <li className="socialShareListItem">
                                      <TwitterShareButton url={photoDetail.photo.url} title={photoDetail.photo.caption} via={photoDetail.photo.caption}>
                                        <TwitterIcon size={32} round={true} />
                                      </TwitterShareButton>
                                    </li>
                                    <li className="socialShareListItem">
                                      <WhatsappShareButton url={photoDetail.photo.url}  title={photoDetail.photo.caption}>
                                        <WhatsappIcon size={32} round={true} />
                                      </WhatsappShareButton>
                                    </li>
                                    <li className="socialShareListItem">
                                      <TelegramShareButton url={photoDetail.photo.url}  title={photoDetail.photo.caption}>
                                        <TelegramIcon size={32} round={true} />
                                      </TelegramShareButton>
                                    </li>
                                    <li className="socialShareListItem">
                                      <EmailShareButton body={photoDetail.photo.url}  subject={photoDetail.photo.caption}>
                                        <EmailIcon size={32} round={true} />
                                      </EmailShareButton>
                                    </li>
                                    {/* <li>
                                      <span
                                        title="Close"
                                        className="fa fa-times-circle"
                                        onClick = {e => this.userAction(e, "close")}
                                        />Close
                                    </li> */}
                                </SSlist>
                          
                        </SocialStyle>
                        <div>
                          {photoShareSetting[0].like && (
                            <span
                              className="pointer d-inline-block"
                              onClick={e =>
                                this.switchScreen(PHOTOS.LANDING_SUB_PATH.LIKES)
                              }
                            >
                              {photoDetail.likedCount} LIKES
                            </span>
                          )}
                          <p>{photoDetail.photo.caption}</p>
                          {photoShareSetting[0].comment && (
                            <small
                              className="d-block pointer"
                              onClick={e =>
                                this.switchScreen(
                                  PHOTOS.LANDING_SUB_PATH.COMMENTS
                                )
                              }
                            >
                              View all {photoDetail.commentCount} comments
                            </small>
                          )}
                        </div>
                      </CaptionWrapper>
                    ) : null}
                  </Fragment>
                ) : null}
              </PhotoWrapper>
            </Fragment>
          )}
          {photoDetail.photo &&
          subPath &&
          subPath === PHOTOS.LANDING_SUB_PATH.COMMENTS ? (
            <Comments
              guestId={this.state.guestId}
              photo={photoDetail.photo}
              parentCommentId={commentId}
            />
          ) : null}
          {photoDetail.photo &&
          subPath &&
          subPath === PHOTOS.LANDING_SUB_PATH.LIKES ? (
            <Likes guestId={this.state.guestId} photo={photoDetail.photo} />
          ) : null}
        </PageContent>

        <div className={`modal fade ${showDeleteDialog ? "show" : ""}`}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Photo</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span
                    aria-hidden="true"
                    onClick={() => this.setState({ showDeleteDialog: false })}
                  >
                    &times;
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the image?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.deletePhotoConfirm()}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => this.setState({ showDeleteDialog: false })}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </PhotoPage>
    );
  }
}

function mapStateToProps(state) {
  return {
    photoDetail: getPhotoDetail(state),
    base64: getImageDownloadDetail(state),
    photoShareSetting: getSettings(state)
  };
}

export default connect(mapStateToProps)(PhotoLanding);
