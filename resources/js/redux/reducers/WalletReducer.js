import * as ActionTypes from '../ActionTypes';

const initState = {
    loading: false,
    nonce: null,
    tried: false,
    status: false,
    account: null,
    connecterror: "",
};

const WalletReducer = (state = initState, action) => {
    switch (action.type) {
        case ActionTypes.WALLET_NONCE_START:
            return {
                ...state,   
                loading: true,
                tried: false,
                status: false,
                account: null,
                connecterror: "",            
            };
        case ActionTypes.WALLET_NONCE_SUCCESS:
            return {
                ...state,
                loading: false,
                tried: true,
                nonce: action.payload,
            };
        case ActionTypes.WALLET_NONCE_ERROR:
            return {
                ...state,
                loading: false,
                connecterror: action.payload,
            };
        case ActionTypes.WALLET_AUTH_START:
            return {
                ...state,
                loading: true,
                tried: false,
            };
        case ActionTypes.WALLET_AUTH_SUCCESS:
            return {
                ...state,
                loading: false,
                status: action.payload.status,
                account: action.payload.account,
            };
        case ActionTypes.WALLET_AUTH_ERROR:
            return {
                ...state,
                loading: false,
                status: false,             
                account: null,
                connecterror: action.payload,
            }; 
        case ActionTypes.WALLET_DISCONNECT: 
            return {
                ...state,
                status: false,             
                account: null,
                connecterror: "",
            };
        default:
            return state;
    }
};

export default WalletReducer;