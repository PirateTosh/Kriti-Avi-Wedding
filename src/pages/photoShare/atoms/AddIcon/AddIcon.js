import React from "react";

import { Icon, Input } from "./AddIcon.styles";

const AddIcon = props => {
  return (
    <Icon>
      <Input type="file" name="photos" value="" accept="image/*" onChange={props.onFileSelection}/>
    </Icon>
  );
};

export default AddIcon;
