import React from 'react';
import { string } from 'prop-types';

import { Title } from './PageTitle.styles';

const propTypes = {
    className: string,
    tag: string.isRequired,
    label: string.isRequired
}

const defaultProps = {
    className: ''
}

const PageTitle = (props) => {
    const { tag, label } = props;
    return (
    <Title className={props.className} tag={tag}>{label}</Title>
    );
}

PageTitle.propTypes = propTypes;
PageTitle.defaultProps = defaultProps;

export default PageTitle;