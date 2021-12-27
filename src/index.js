import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from "react-redux";
import store from "./store";
import routes from "./routes";
import { Router, browserHistory } from 'react-router';
import Meteor from "react-web-meteor";
 //Meteor.connect('ws://localhost:3015/websocket');
Meteor.connect('wss://thekeysolution.in/websocket');
// Meteor.connect('wss://the-keyapp.com/websocket');

// console.log = function(){};
// console.error = function(){};
// console.warn = function(){};


ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();

