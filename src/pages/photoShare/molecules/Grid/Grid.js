import React, { Fragment } from "react";
import { browserHistory } from "react-router";
import LazyLoad from "react-lazyload";

import { Row, Column } from "./Grid.styles";

import Image from "../../../../common/atoms/Image";

import { PHOTOS } from "../../../../constants";

class Grid extends React.PureComponent {
  render() {
    const { items, className, column } = this.props;
    let imageStyle;
    return (
      <Fragment>
        {items && Object.keys(items).length
          ? Object.keys(items).map(key => {
              return (
                <Fragment key={key}>
                  {items[key].length ? (
                    <Fragment>
                      <h6 className="px-2 mt-1 mb-0">
                        <small>
                          {key.toLowerCase() === "sticky" ? "" : key}
                        </small>
                      </h6>
                      <Row className={className}>
                        {items[key].map(item => {
                          imageStyle = {
                            position: "absolute",
                            height: "100%",
                            width: "100%",
                            top: "0",
                            left: "0",
                            backgroundImage: `url(${item.url})`,
                            backgroundSize: "cover",
                            filter: "blur(10px)"
                          };
                          return (
                            <Column key={item._id} column={column}>
                              <div className="imageContainer">
                                <a
                                  style={{
                                    display: "flex",
                                    height: "100%",
                                    width: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minHeight: "200px"
                                  }}
                                  onClick={() => {
                                    browserHistory.push(
                                      `/${PHOTOS.LANDING}/${item._id}`
                                    );
                                  }}
                                >
                                  <LazyLoad height={200}>
                                    <Image alt={item.caption} src={item.url} />
                                    <div style={imageStyle} />
                                  </LazyLoad>
                                </a>
                              </div>
                            </Column>
                          );
                        })}
                      </Row>
                    </Fragment>
                  ) : null}
                </Fragment>
              );
            })
          : null}
      </Fragment>
    );
  }
}

export default Grid;
