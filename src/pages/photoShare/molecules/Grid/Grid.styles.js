import styled from "styled-components";

export const Row = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export const Column = styled.div`
  position: relative;
  width: calc(100% / ${props => props.column || 3});
  padding: 0 8px 15px;
  & .imageContainer {
    position: relative;
    background: #fff;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;
