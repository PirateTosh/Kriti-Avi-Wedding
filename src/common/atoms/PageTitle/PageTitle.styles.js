import React from 'react';
import styled from "styled-components"

export const Title = styled(({tag, ...props }) => React.createElement(tag, props))`
  color: #fff;
  padding: 1em;
  text-align: center;
  font-size: 1.75em;
  margin:0;
`