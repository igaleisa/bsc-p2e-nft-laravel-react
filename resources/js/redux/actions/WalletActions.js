import * as ActionTypes from '../ActionTypes';
import { WalletNonceService, WalletAuthService, } from '../../services/WalletService';
import { LogoutAction, } from '@/redux/actions/AuthActions';

export const WalletNonceAction = (account) => {
    return (dispatch) => {
        dispatch({type: ActionTypes.WALLET_NONCE_START});
        WalletNonceService(account).then((res) => {
            if(res.hasOwnProperty('success') && res.success === true) {
                dispatch({type: ActionTypes.WALLET_NONCE_SUCCESS, payload: res.nonce});
            } else {
                dispatch({type: ActionTypes.WALLET_NONCE_ERROR, payload: res.error});
            }
        }).catch((err) => {
            console.log(err);
            dispatch({type: ActionTypes.WALLET_NONCE_ERROR, payload: err});
        });        
    }
}

export const WalletAuthAction = (account, signature) => {
    return (dispatch) => {
        dispatch({type: ActionTypes.WALLET_AUTH_START});
        WalletAuthService(account, signature).then((res) => {
            if(res.hasOwnProperty('success') && res.success === true) {
                dispatch({type: ActionTypes.WALLET_AUTH_SUCCESS, payload: res});
            } else {
                dispatch({type: ActionTypes.WALLET_AUTH_ERROR, payload: res.error});
            }
        }).catch((err) => {
            console.log(err);
            dispatch({type: ActionTypes.WALLET_AUTH_ERROR, payload: err});
        });    
    }
}

export const WalletDisconnectAction = () => {
    return (dispatch) => {
        dispatch({type: ActionTypes.WALLET_DISCONNECT});
    }
}