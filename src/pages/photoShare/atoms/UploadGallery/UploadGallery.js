import React from "react";

import { Icon, Input } from "./UploadGallery.styles";

const UploadGallery = props => {
  return (
    <Icon isCamera={props.isCamera} className={props.isCamera ? 'camera': ''}>
      <Input type="file" name="file" value="" />
    </Icon>
  );
};

export default UploadGallery;
