import styled from "styled-components";

export const Icon = styled.span`
  position: relative;
  border-radius: 100%;
  width: 45px;
  height: 45px;
  text-align: center;
  box-shadow: 0px 0px 17px 5px rgba(0, 0, 0, 0.8);
  background: #fff;
  overflow: hidden;
  display: inline-block;
  &::after {
    font-family: "Conv_bmt-icons";
    content: "\\73";
    font-size: 1.5rem;
    color: #000;
    position: relative;
    border-radius: 100%;
    display: block;
    line-height: 46px;
  }
  &.camera::after {
    content: "\\72";
  }
`;

export const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: visible !important;
  opacity: 0;
  z-index: 10;
`;
