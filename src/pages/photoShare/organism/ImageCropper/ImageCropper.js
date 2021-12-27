import React from "react";
import { connect } from "react-redux";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { string, func, objectOf, any } from "prop-types";

import { getAllGuests, getGuestGroups } from "../../stateSelector";
import { fetchAllGuests, fetchGuestGroups } from "../../../../api/photoShared";

import {
  Form,
  Input,
  Select,
  Button,
  CropImageWrapper,
  FileInput
} from "./ImageCropper.styles";

import CreateGroup from "../../molecules/CreateGroup";
import Spinner from "../../../../common/atoms/Spinner";

class ImageCropper extends React.PureComponent {
  static isImageLoaded = false;
  static propTypes = {
    className: string,
    uploadPhoto: func.isRequired,
    files: objectOf(any).isRequired,
    guestId: string.isRequired
  };

  static defaultProps = {
    className: ""
  };

  state = {
    createNewGroup: false,
    isGroupShare: false,
    caption: "",
    groupId: "",
    file: null,
    src: null,
    crop: {
      aspect: 1,
      width: 50,
      x: 0,
      y: 0
    },
    loading: false,
    rotate: 0
  };

  constructor(props) {
    super(props);
    this.onSelectFile(props.files);
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    fetchGuestGroups(this.props.guestId);
  }

  onSelectFile = files => {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(files[0]);
    }
  };

  onImageLoaded = (image, pixelCrop) => {
    this.imageRef = image;
    if (!this.isImageLoaded) {
      this.isImageLoaded = true;
      this.onCropComplete(this.state.crop, pixelCrop);
    }
  };

  onCropComplete = (crop, pixelCrop) => {
    this.setState({pixelCrop});
    this.makeClientCrop(crop, pixelCrop);
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  rotateImage() {
    this.setState({rotate: this.state.rotate === 270 ? 0 : this.state.rotate + 90 }, () => {
      this.makeClientCrop(this.state.crop, this.state.pixelCrop)
    })
  }

  async makeClientCrop(crop, pixelCrop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        pixelCrop,
        "newFile.jpg",
        this.state.rotate
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, pixelCrop, fileName, rotate) {
    const _self = this;
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    if(rotate){
      ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
      ctx.rotate(rotate*Math.PI/180);
      ctx.translate(-canvas.width * 0.5, -canvas.height * 0.5);
    }

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    if(rotate){
      ctx.restore();
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        _self.setState({ file: new File([blob], "newFile.jpg") });
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  uploadPhoto() {
    if (this.state.caption && this.state.croppedImageUrl) {
      const data = {
        caption: this.state.caption,
        groupId: this.state.isGroupShare ? this.state.groupId : null
      };
      this.setState({ loading: true });
      this.props.uploadPhoto(data, [this.state.file]);
    }
  }

  onGroupSelect(value) {
    if (!this.props.guestsList.length) {
      fetchAllGuests();
    }
    if (value === "NEW") {
      this.setState({ createNewGroup: true });
    } else {
      this.setState({ groupId: value });
    }
  }

  onGroupCreate(groupInfo) {
    this.setState({
      createNewGroup: false,
      groupId: groupInfo ? groupInfo._id : ""
    });
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;
    return (
      <Form autoComplete="off" className="invitationMessage appGradientColor">
        {!this.state.createNewGroup ? (
          <CropImageWrapper>
            {src && (
              <div className={`rotate-${this.state.rotate}`}>
              <div className="image-block">
              <ReactCrop
                src={src}
                crop={crop}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
              />
              </div>
              </div>
            )}
            <div className="form-group mt-3">
            <img className="mt-2 mb-3 d-block demoImage" src={this.state.croppedImageUrl} />
              <Button type="button" className="textboxTransparent btn btn-sm imageUpload">
                Change Image
                <FileInput
                  type="file"
                  name="photos"
                  value=""
                  onChange={e => this.onSelectFile(e.target.files)}
                />
              </Button>
              <Button type="button" className="btn btn-sm ml-3" onClick={() => this.rotateImage()}>
              <i className="fa fa-repeat mr-2" aria-hidden="true"></i>
              Rotate
              </Button>
            </div>
            <div className="form-group">
              <label htmlFor="searchText" className="m-0">Photo Caption</label>
              <Input
                className="form-control form-control-color"
                type="text"
                value={this.state.caption}
                name="caption"
                id="caption"
                onChange={e => this.setState({ caption: e.target.value })}
              />
            </div>

            <div className="radio-group">
              <Input
                type="radio"
                value="public"
                name="type"
                id="publicShare"
                checked={!this.state.isGroupShare}
                onChange={() => this.setState({ isGroupShare: false })}
              />
              <label htmlFor="publicShare">Public</label>
              <Input
                type="radio"
                value="group"
                name="type"
                id="groupShare"
                checked={this.state.isGroupShare}
                onChange={() => this.setState({ isGroupShare: true })}
              />
              <label htmlFor="groupShare">Group</label>
            </div>

            {this.state.isGroupShare && (
              <div className="form-group">
                <Select
                  className="form-control form-control-color"
                  name="groupName"
                  value={this.state.groupId}
                  onChange={e => this.onGroupSelect(e.target.value)}
                >
                  <option value="">Select One</option>
                  <option value="NEW">Create</option>
                  {this.props.groupsList.map(group => (
                    <option value={group._id} key={group._id}>
                      {group.groupName}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            <Button
              type="button"
              className="textboxTransparent btn btn-sm"
              onClick={() => this.uploadPhoto()}
            >
              Upload
            </Button>
          </CropImageWrapper>
        ) : (
          <CreateGroup
            guestsList={this.props.guestsList}
            guestId={this.props.guestId}
            onGroupCreate={groupInfo => this.onGroupCreate(groupInfo)}
            groupsList={this.props.groupsList}
          />
        )}
        {this.state.loading ? <Spinner /> : ""}
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    guestsList: getAllGuests(state),
    groupsList: getGuestGroups(state)
  };
}

export default connect(mapStateToProps)(ImageCropper);
