import React from "react";
import { Link } from "react-router";
import $ from 'jquery';
import {
  DropDownContainer,
  DropDownMenu,
  DropDownItem
} from "./DropDown.styles";

import { PHOTOS } from "../../../../constants";

class DropDown extends React.PureComponent {
  state = {
    opened: false
  };

  onItemClick() {
    this.setState({ opened: !this.state.opened });
  }
  
  render() {   
      $("#spanHeaderText").html("Photo Sharing");
    // const grid = this.props.column === 1 ? 2 : this.props.column - 1;
    const grid = this.props.column === 3 ? 1 : 3;
    return (
      <DropDownContainer>
        <span
          className="dotdotdot"
          onClick={() => this.setState({ opened: !this.state.opened })}
        >
          <i />
        </span>
        <DropDownMenu className="appGradientColor"
          style={{ display: this.state.opened ? "block" : "none" }}
          onClick={() => this.setState({ opened: false })}
        >
          <DropDownItem
            className=""
            onClick={() => {
              this.onItemClick();
              this.props.changeLayout(grid);
            }}
          >
            <span className="icon">
              <i />
              <i style={{ display: grid >= 2 ? "block" : "none" }} />
              <i style={{ display: grid >= 3 ? "block" : "none" }} />
            </span>
            <i className="fa fa-ellipsis-v" style={{marginLeft:"6px", paddingRight: "6px"}} aria-hidden="true"></i>
            <span className="dropdownMenu">Layout</span>
          </DropDownItem>
          <DropDownItem>
            <i className="fa fa-heart-o" aria-hidden="true"></i>
            <Link to={`/${PHOTOS.BASE_PATH}/${PHOTOS.SUB_PATH.FAVORITE}`}>
            <span className="dropdownMenu">Likes</span>
            </Link>
          </DropDownItem>
          <DropDownItem>
            <span className="fa fa-star-o" aria-hidden="true" />
            <Link to={`/${PHOTOS.BASE_PATH}/${PHOTOS.SUB_PATH.MOSTLIKED}`}>
             <span className="dropdownMenu">Most Liked</span>
            </Link>
          </DropDownItem>
          <DropDownItem>
            <span className="fa fa-share-alt" />
            <Link to={`/${PHOTOS.BASE_PATH}/${PHOTOS.SUB_PATH.SHAREDBYME}`}>
             <span className="dropdownMenu">Shared By Me</span>
            </Link>
          </DropDownItem>
          <DropDownItem>
            <span className="fa fa-users" />
            <Link to={`/${PHOTOS.BASE_PATH}/${PHOTOS.MY_GROUPS}`}>
            <span className="dropdownMenu">Groups</span>
            </Link>
          </DropDownItem>
        </DropDownMenu>
      </DropDownContainer>
    );
  }
}

export default DropDown;
