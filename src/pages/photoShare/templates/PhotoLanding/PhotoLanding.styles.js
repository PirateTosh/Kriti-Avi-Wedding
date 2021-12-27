import styled from "styled-components";

export const PhotoPage = styled.div`
  position: relative;
  max-width: 800px;
  margin: 50px auto 0;
  .modal.show {
    display: block;
    .close:before{
      content: "";
    }
  }
  .modal-dialog {
    transform: translate(0%, 50%) !important;
  }
  .modal-content {
    background: #fff !important;
    color: #212529;
  }
`;

export const PageContent = styled.div`
  position: relative;
`;

export const PhotoWrapper = styled.div`
  width: 100%;
  & figure {
    width: 100%;
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0;
  }
`;

export const CaptionWrapper = styled.div`
  margin: 0 0 1rem;
  .pointer {
    cursor: pointer
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

export const ActionElements = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  & li {
    display: inline-block;
    width: auto;
    padding: 0;
    margin: 0 1rem 1rem 0;
    & .fa {
      font-size: 1.5rem;
    }
  }
`;
export const SocialStyle = styled.div`
  display: none;
  margin: 0px;
  padding: 0px;
`;
export const SSlist = styled.ul`
display: inline-flex;
& li {
  padding-right: 5px;
}
`