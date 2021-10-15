import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import RootReducer from "./reducers/RootReducer"
import { composeWithDevTools } from 'redux-devtools-extension';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash.throttle';

const persistedState = loadState();

export const store = createStore(
    RootReducer,
    persistedState,
    composeWithDevTools(
        applyMiddleware(thunk)
    ),
);

store.subscribe(throttle(() => {
    saveState(store.getState());
}, 1000));