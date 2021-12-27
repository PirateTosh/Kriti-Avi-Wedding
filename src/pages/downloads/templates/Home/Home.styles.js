import styled from "styled-components";

export const DownloadPage = styled.div`
  // position: relative;
  // max-width: 1200px;
  // margin: 50px auto 0;
  @media (min-width: 768px) {
    margin-top: 90px;
  }
`;

export const DownloadContent = styled.div`
  position: relative;
  & .fa-download {
    position: relative !important;
  }
`;
