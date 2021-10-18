import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import ProfileReducer from "./ProfileReducer";
import WalletReducer from "./WalletReducer";

const RootReducer = combineReducers({
    userAuth: AuthReducer,
    userWallet: WalletReducer,
    // userDetails: ProfileReducer,
});

export default RootReducer;