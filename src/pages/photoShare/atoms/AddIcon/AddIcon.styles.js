import styled from "styled-components";

export const Icon = styled.span`
  position: fixed;
  top: 75vh;
  left: 75vw;
  border-radius: 100%;
  width: 55px;
  height: 55px;
  text-align: center;
  box-shadow: 0 0 17px 5px rgba(0, 0, 0, 0.8);
  background: #fff;
  overflow: hidden;
  z-index : 999;
  &::after {
    font-family: "Conv_bmt-icons";
    content: "\\75";
    font-size: 1.8rem;
    color: #000;
    position: relative;
    border-radius: 100%;
    display:block;
    line-height: 56px;
  }
  &.back::after{
    content: "\\61";
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
