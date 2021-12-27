import { createStore, applyMiddleware, compose } from 'redux';
import reducers from "./reducers/index";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware(
            thunk,
            reduxImmutableStateInvariant(),
            logger
        )
    )
);

export default store;
