import styled from "styled-components";

export const GroupPage = styled.div`
  position: relative;
  max-width: 800px;
  margin: 50px auto 0;
`;

export const PageContent = styled.div`
  position: relative;
  .groups-list .rounded{
    border: 1px solid;
  }
`;

export const Header = styled.div`
  margin: 0;
  padding-bottom: 10px;
  & span {
    display: block;
    text-align: center;
    margin-bottom: 10px;
    text-transorm: uppercase;
  }
  & small {
    display: block;
  }
`;
