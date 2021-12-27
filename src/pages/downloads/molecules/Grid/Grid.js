import React, { Fragment } from "react";

import { Row } from "./Grid.styles";

class Grid extends React.PureComponent {
  render() {
    const { className } = this.props;
    return (
      <Fragment>
        <Row className={className}>
          <div>Test string</div>
        </Row>
      </Fragment>
    );
  }
}

export default Grid;
