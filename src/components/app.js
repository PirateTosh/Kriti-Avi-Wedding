import React, { Component } from 'react';
import get from "lodash/get";
import { Route,Router, browserHistory } from 'react-router';
import {Switch} from "react-router-dom";
import Popup from 'react-popup';

class app extends Component {
    render() {
        let path = get(this.props, "location.pathname", "");
        return(
            <div>
                {this.props.children}
            </div>
        )
    }
}


export default app;
