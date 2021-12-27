import React from 'react';

import { Image as Img } from './Image.styles';

const Image = (props) => <Img className={props.className} alt={props.alt} src={props.src} />;

export default Image;
