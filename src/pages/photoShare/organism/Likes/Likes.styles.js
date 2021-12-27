import styled from "styled-components";

export const LikesWarpper = styled.div`
  padding: 20px;
  position: relative;
  .icon {
    vertical-align: middle !important;
    min-width: 30px;
    display: inline-block;
    vertical-align: text-top;
    &::before {
      font-family: "Conv_bmt-icons";
      font-size: 1.5rem;
      font-style: normal;
    }
    &.fa-heart {
        color: red;
    }
  }
  .faded {
    opacity: 0.5;
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

export const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    display: block;
    margin: 0 0 10px;
  }
  .like {
    display: block;
  }
`;
