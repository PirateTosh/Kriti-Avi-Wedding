import React from "react";

import { SpinnerContainer } from "./Spinner.styles";

const Spinner = props => {
  return (
    <SpinnerContainer>
      <span>
        <i className="icon-loading fa-spin" />
      </span>
    </SpinnerContainer>
  );
};

export default Spinner;
