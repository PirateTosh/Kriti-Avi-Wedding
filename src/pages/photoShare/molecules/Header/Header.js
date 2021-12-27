import React from "react";
import { Link } from 'react-router';

import { PHOTOS } from "../../../../constants";

import { HeaderContainer } from './Header.styles';

import DropDown from '../DropDown';

const Header = props => {
  const { params, column } = props;
  return (
    <HeaderContainer className="d-block destinationMobile">
      <div className="col-md-12 col-sm-12 col-xs-12 scrollMobile">
        <Link
          to={`/${PHOTOS.BASE_PATH}`}
          className={`  BtnCommon btn appBodyFontFamily appBodyFontColor commonBtnDestination ${
            !params.subPath ? "active" : ""
          }`}
        >
          FEATURED
        </Link>
        <Link
          to={`/${PHOTOS.BASE_PATH}/${PHOTOS.SUB_PATH.GUESTS.toLowerCase()}`}
          className={`  BtnCommon btn appBodyFontFamily appBodyFontColor commonBtnDestination ${
            params.subPath ? "active" : ""
          }`}
        >
          GUEST SHARED
        </Link>
        {(props.guestId && props.changeLayout) && <DropDown changeLayout={props.changeLayout} column={column}/>}
      </div>
    </HeaderContainer>
  );
};

export default Header;
