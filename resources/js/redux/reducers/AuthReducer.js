import * as ActionTypes from '../ActionTypes';

const initState = {
    loading: false,
    isEmailVerifyRequired: false,
    isAuthenticated: false,
    isAdmin: false,
    currentUser: null,
    token: localStorage.getItem("user-token")
        ? localStorage.getItem("user-token")
        : null,
    error: "",    
};

const AuthReducer = (state = initState, action) => {
    switch (action.type) {
        case ActionTypes.RESET_LOADING:
            return {
                ...state,
                loading: false,
            };
        case ActionTypes.RESET_ERROR:
            return {
                ...state,
                error: "",
            };
        case ActionTypes.RESTART_AUTH_RESPONSE:
            return {
                ...state,   
                loading: false,
                isEmailVerifyRequired: false,            
                isAuthenticated: false,
                isAdmin: false,
                currentUser: null,
            };
        case ActionTypes.LOADING:
            return {
                ...state,
                loading: true,
            };
        case ActionTypes.SIGNUP_SUCCESS:
            return {
                ...state,
                isEmailVerifyRequired: true,
                isAuthenticated: false,
                currentUser: action.payload.user.email,
                loading: false,
                error: "",  
            };
        case ActionTypes.SIGNUP_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
                currentUser: null,
                isAuthenticated: false,
                isAdmin: false,
                isEmailVerifyRequired: false,
            };
        case ActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                isEmailVerifyRequired: action.payload.user.emailVerificationRequired,
                isAuthenticated: action.payload.user.emailVerificationRequired === true ? false : true,
                isAdmin: action.payload.user.role === "admin",
                currentUser: action.payload.user.email,
                token: action.payload.token,
                error: "",
            };
        case ActionTypes.LOGIN_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                currentUser: null,
                isAuthenticated: false,
                isAdmin: false,
                isEmailVerifyRequired: false,
            }; 
        case ActionTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                isAdmin: false,
                currentUser: null,
                isEmailVerifyRequired: false,
                token: null,
                error: "",
            };
        case ActionTypes.LOGOUT_ERROR:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                isAdmin: false,
                isEmailVerifyRequired: false,
                error: action.payload.error,
                currentUser: null,
            }; 
        case ActionTypes.CODE_ERROR:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                isAdmin: false,
                isEmailVerifyRequired: false,
                error: action.payload,
                currentUser: null,
                token: null,
            };
        default:
            return state;
    }
};

export default AuthReducer;