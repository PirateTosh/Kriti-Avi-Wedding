import styled from "styled-components";

export const DropDownContainer = styled.div`
  position: relative;
  & .dotdotdot {
    margin-left: 16px;
    display: inline-block;
    height: 100%;
    white-space: nowrap;
    padding-top: 2px;
    & i {
      width: 25px;
      height: 3px;
      background-color: var(--font-color);
      box-shadow: 0px 14px 0px var(--font-color), 0px 28px 0px var(--font-color);
      vertical-align: text-top;
      display: inline-block;
    }
  }
`;

export const DropDownMenu = styled.ul`
  min-width: 175px;
  margin: 0;
  padding: 10px;
  box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 100%;
  right: -20px;
`;
export const DropDownItem = styled.li`
  color: var(--font-color);
  cursor: pointer;
  margin: 0 0 5px 0;
  & > * {
    vertical-align: middle;
  }
  & a {
    color: inherit;
    text-decoration: none;
  }
  & .fa {
    margin-right: 10px;
  }
  &.dotdotdot {
    margin-left: 0;
    & i {
      width: 3px;
      height: 3px;
      box-shadow: 0px 6px 0px #fff, 0px 12px 0px #fff;
      margin-right: 5px;
      float: left;
    }
  }
`;
