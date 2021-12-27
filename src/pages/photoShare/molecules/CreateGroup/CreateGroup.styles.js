import styled from "styled-components";

export const GroupContainer = styled.div`
  position: relative;
  padding: 10px;
`;

export const Input = styled.input``;

export const SearchContainer = styled.div`
  position: relative;
  z-index: 10;
  .clear {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(-10%, -50%);
  }
`;

export const ResultContainer = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 5px 6px 0px rgba(0, 0, 0, 0.5);
  color: #000;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 10px;
  &.selected {
    position: relative;
    top: auto;
    background: transparent;
    box-shadow: none;
    color: inherit;
  }
  & li {
    margin: 0;
    padding: 3px 5px;
  }
  & input[type="checkbox"] {
    visibility: visible;
    display: inline-block;
    position: relative;
    margin: 0 10px 0 0;
  }
`;
