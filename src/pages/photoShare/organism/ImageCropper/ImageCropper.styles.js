import styled from "styled-components";

export const Input = styled.input``;

export const Select = styled.select``;

export const Button = styled.button``;

export const CropImageWrapper = styled.div``;

export const Form = styled.form`
  position: relative;
  & .imageUpload {
    overflow: hidden;
    position: relative;
  }

  .demoImage{
    width: 100px;
  }
`;

export const FileInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: visible !important;
  opacity: 0;
  z-index: 10;
`;
