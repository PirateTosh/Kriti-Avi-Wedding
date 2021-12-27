
import React from "react";

import {Route, Redirect} from 'react-router-dom';

export default function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => (localStorage.getItem('guestId'))
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
};

