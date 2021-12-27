import React from "react";
import { connect } from "react-redux";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import EXIF from "exif-js";

import { string, func, objectOf, any } from "prop-types";

import { getAllGuests, getGuestGroups } from "../../stateSelector";
import { fetchAllGuests, fetchGuestGroups } from "../../../../api/photoShared";

import {
  Form,
  Input,
  Select,
  Button,
  CropImageWrapper,
  FileInput,
} from "./ImageWithoutCropper.styles";

import CreateGroup from "../../molecules/CreateGroup";
import Spinner from "../../../../common/atoms/Spinner";

class ImageWithoutCropper extends React.PureComponent {
  static isImageLoaded = false;
  static propTypes = {
    className: string,
    uploadPhoto: func.isRequired,
    files: objectOf(any).isRequired,
    guestId: string.isRequired,
    cancelUpload: func.isRequired,
  };

  static defaultProps = {
    className: "",
  };

  state = {
    createNewGroup: false,
    isGroupShare: false,
    caption: "",
    groupId: "",
    file: null,
    src: null,
    crop: {
      aspect: 16 / 9,
      width: 100,
      x: 0,
      y: 0,
    },
    loading: false,
    rotate: 0,
  };

  constructor(props) {
    super(props);
    this.onSelectFile(props.files);
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    fetchGuestGroups(this.props.guestId);
  }

  onSelectFile = (files) => {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(files[0]);
    }
  };

  onImageLoaded = (image, pixelCrop) => {
    const _self = this;
    this.setState({
      crop: {
        aspect: image.naturalWidth / image.naturalHeight,
        width: 100,
        x: 0,
        y: 0,
      },
      rotate: 270,
    });

    EXIF.getData(image, function () {
      _self.resetOrientation(
        image.src,
        EXIF.getTag(this, "Orientation"),
        (resetBase64Image) => {
          _self.imageRef = resetBase64Image;
          // to fix the bug of image rotation while uploading
          // initial set the rotate: 270 and rotate the image 1 time;
          _self.rotateImage();
        }
      );
    });
  };

  resetOrientation(srcBase64, srcOrientation, callback) {
    const _self = this;
    const img = new Image();

    img.onload = function () {
      const width = img.width,
        height = img.height,
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");

      // set proper canvas dimensions before transform & export
      if (4 < srcOrientation && srcOrientation < 9) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      // transform context before drawing image
      switch (srcOrientation) {
        case 2:
          ctx.transform(-1, 0, 0, 1, width, 0);
          break;
        case 3:
          ctx.transform(-1, 0, 0, -1, width, height);
          break;
        case 4:
          ctx.transform(1, 0, 0, -1, 0, height);
          break;
        case 5:
          ctx.transform(0, 1, 1, 0, 0, 0);
          break;
        case 6:
          ctx.transform(0, 1, -1, 0, height, 0);
          break;
        case 7:
          ctx.transform(0, -1, -1, 0, height, width);
          break;
        case 8:
          ctx.transform(0, -1, 1, 0, 0, width);
          break;
        default:
          break;
      }

      // draw image
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          blob.name = "newFile.jpg";
          window.URL.revokeObjectURL(this.fileUrl);
          this.fileUrl = window.URL.createObjectURL(blob);
          _self.setState({
            croppedImageUrl: this.src,
            file: new File([blob], "newFile.jpg", {
              type: "image/jpeg",
            }),
          });
          callback(this);
        },
        "image/jpeg",
        0.5
      );
    };

    img.src = srcBase64;
  }

  onCropComplete = (crop, pixelCrop) => {
    this.setState({ pixelCrop });
    this.makeClientCrop(crop, pixelCrop);
  };

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  rotateImage() {
    this.setState(
      { rotate: this.state.rotate === 270 ? 0 : this.state.rotate + 90 },
      () => {
        this.makeClientCrop(this.state.crop, this.state.pixelCrop);
      }
    );
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
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    const x = pixelCrop.x;
    const y = pixelCrop.y;
    canvas.width =
      rotate === 90 || rotate === 270
        ? image.naturalHeight
        : image.naturalWidth;
    canvas.height =
      rotate === 90 || rotate === 270
        ? image.naturalWidth
        : image.naturalHeight;
    const ctx = canvas.getContext("2d");

    if (rotate >= 0) {
      let a = 0;
      let b = 0;
      if (rotate === 90) {
        a = (canvas.height - canvas.width) / 2;
        b = (canvas.width - canvas.height) / 2;
        ctx.translate((canvas.width - a) / 2, (canvas.height + b) / 2);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.translate(-(canvas.width + a) / 2, -(canvas.height + b) / 2);
      } else if (rotate === 270) {
        a = (canvas.height - canvas.width) / 2;
        b = (canvas.width - canvas.height) / 2;
        ctx.translate((canvas.width + a) / 2, (canvas.height - b) / 2);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.translate(-(canvas.width + a) / 2, -(canvas.height + b) / 2);
      } else {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
      }
    }

    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    if (rotate >= 0) {
      ctx.restore();
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        _self.setState({ file: blob });
        // _self.setState({ file: new File([blob], "newFile.jpg", {
        //   type: "image/jpeg",
        // }) });
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  uploadPhoto() {
    if (this.state.croppedImageUrl) {
      const data = {
        caption: this.state.caption,
        groupId: this.state.isGroupShare ? this.state.groupId : null,
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
      groupId: groupInfo ? groupInfo._id : "",
    });
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;
    return (
      <Form autoComplete="off" className="invitationMessage appGradientColor">
        {!this.state.createNewGroup ? (
          <CropImageWrapper>
            {src && (
              <div className={`source-image-block rotate-${this.state.rotate}`}>
                <ReactCrop
                  locked={true}
                  src={src}
                  crop={crop}
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                />
              </div>
            )}
            <div className="form-group">
              <div className="mb-3 d-block demoImage">
                <img src={this.state.croppedImageUrl} />
              </div>
              <Button
                type="button"
                className="textboxTransparent btn btn-sm imageUpload"
              >
                Change Image
                <FileInput
                  type="file"
                  name="photos"
                  value=""
                  accept="image/*"
                  onChange={(e) => this.onSelectFile(e.target.files)}
                />
              </Button>
              <Button
                type="button"
                className="textboxTransparent btn btn-sm ml-3"
                onClick={() => this.rotateImage()}
              >
                <i className="fa fa-repeat mr-2" aria-hidden="true" />
                Rotate
              </Button>
            </div>
            <div className="form-group">
              <Input
                className="form-control form-control-color"
                type="text"
                value={this.state.caption}
                name="caption"
                id="caption"
                placeholder="Photo Caption(optional)"
                onChange={(e) => this.setState({ caption: e.target.value })}
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
                  onChange={(e) => this.onGroupSelect(e.target.value)}
                >
                  <option value="">Select One</option>
                  <option value="NEW">Create</option>
                  {this.props.groupsList.map((group) => (
                    <option value={group._id} key={group._id}>
                      {group.groupName}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            <Button
              type="button"
              className="btn uploadBtn"
              onClick={() => this.uploadPhoto()}
            >
              Upload
            </Button>
            <Button
              type="button"
              className="textboxTransparent btn ml-3"
              onClick={() => this.props.cancelUpload()}
            >
              Cancel
            </Button>
          </CropImageWrapper>
        ) : (
          <CreateGroup
            guestsList={this.props.guestsList}
            guestId={this.props.guestId}
            onGroupCreate={(groupInfo) => this.onGroupCreate(groupInfo)}
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
    groupsList: getGuestGroups(state),
  };
}

export default connect(mapStateToProps)(ImageWithoutCropper);
