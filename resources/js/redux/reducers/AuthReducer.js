import * as ActionTypes from '../ActionTypes';

const initState = {
    loading: false,
    is2FA: false,
    isEmailVerifyRequired: false,
    isAuthenticated: false,
    isAdmin: false,
    currentUserEmail: null,
    currentUserName: null,
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
                is2FA: false,
                isEmailVerifyRequired: false,            
                isAuthenticated: false,
                isAdmin: false,
                currentUserEmail: null,
                currentUserName: null
            };
        case ActionTypes.LOADING:
            return {
                ...state,
                loading: true,
            };
        case ActionTypes.SIGNUP_SUCCESS:
            return {
                ...state,
                is2FA: false,
                isEmailVerifyRequired: true,
                isAuthenticated: false,
                currentUserEmail: action.payload.user.email,
                currentUserName: action.payload.user.name,
                loading: false,
                error: "",  
            };
        case ActionTypes.SIGNUP_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
                currentUserEmail: null,
                currentUserName: null,
                isAuthenticated: false,
                isAdmin: false,
                is2FA: false,
                isEmailVerifyRequired: false,
            };
        case ActionTypes.PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                isEmailVerifyRequired: action.payload.user.emailVerificationRequired,
                isAuthenticated: action.payload.user.emailVerificationRequired === true ? false : true,
                isAdmin: action.payload.user.role === "admin",
                currentUserEmail: action.payload.user.email,
                currentUserName: action.payload.user.username,
                error: "",
            };
        case ActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                is2FA: false,
                isEmailVerifyRequired: action.payload.user.emailVerificationRequired,
                isAuthenticated: action.payload.user.emailVerificationRequired === true ? false : true,
                isAdmin: action.payload.user.role === "admin",
                currentUserEmail: action.payload.user.email,
                currentUserName: action.payload.user.username,
                error: "",
            };
        case ActionTypes.LOGIN_TFA_START:
            return {
                ...state,
                loading: false,
                is2FA: action.payload.tfa
            };
        case ActionTypes.LOGIN_TFA_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        case ActionTypes.LOGIN_TFA_SUCCESS:
            return {
                ...state,
                loading: false,
                is2FA: false,
                isEmailVerifyRequired: action.payload.user.emailVerificationRequired,
                isAuthenticated: action.payload.user.emailVerificationRequired === true ? false : true,
                isAdmin: action.payload.user.role === "admin",
                currentUserEmail: action.payload.user.email,
                currentUserName: action.payload.user.username,
                error: "",
            };
        case ActionTypes.LOGIN_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                currentUserEmail: null,
                currentUserName: null,
                isAuthenticated: false,
                isAdmin: false,
                is2FA: false,
                isEmailVerifyRequired: false,
            }; 
        case ActionTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                is2FA: false,
                isAuthenticated: false,
                isAdmin: false,
                currentUserEmail: null,
                currentUserName: null,
                isEmailVerifyRequired: false,                
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
                currentUserEmail: null,
                currentUserName: null
            }; 
        case ActionTypes.CODE_ERROR:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                isAdmin: false,
                isEmailVerifyRequired: false,
                error: action.payload,
                currentUserEmail: null,
                currentUserName: null,
            };
        default:
            return state;
    }
};

export default AuthReducer;