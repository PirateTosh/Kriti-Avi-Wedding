import styled from "styled-components";

export const CommentWarpper = styled.div`
  padding: 20px;
  position: relative;
  .pointer {
    cursor: pointer;
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
  & p {
    margin: 0;
  }
`;

export const Footer = styled.div`
  position: sticky;
  bottom: 0;
  padding: 10px 0;
  & .form-group {
    position: relative;
    margin: 0;
  }
  & input {
    height: auto !important;
    margin: 0 !important;
  }
  .label {
    max-width: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
    margin-bottom: 5px;
  }
  .clear {
    font-size: 1rem;
  }
`;

export const SendIcon = styled.button`
  cursor: pointer;
  padding: 5px 8px 0;
  margin: 0;
  border: none;
  background: transparent;
  & i {
    margin: 0 0 0 10px;
    vertical-align: middle;
  }
`;

export const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  &.nesting li{
    margin-left: 1rem;
  }
  & li {
    display: block;
    margin: 0 0 10px;
  }
  .parentComment {
    fotn-weight: bold;
    border-bottom: 1px solid;
    margin-left: 0 !important;
    padding-bottom: 10px;
  }
  & .comment {
    display: block;
  }

  .actionList > * {
    margin: 0 10px 0 0;
  }
`;
