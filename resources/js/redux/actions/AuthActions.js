import * as ActionTypes from '../ActionTypes';
import {RegisterUserService, LoginUserService, LogOutUserService} from '../../services/AuthServices';

export const ResetLoadingAction = () => {
    return (dispatch) => {
        dispatch({type: ActionTypes.RESET_LOADING});
    };
};

export const ResetErrorAction = () => {
    return (dispatch) => {
        dispatch({type: ActionTypes.RESET_ERROR});
    };
};

export const RegisterAction = (credentials, history) => {
    return (dispatch) => {
        dispatch({type: ActionTypes.RESTART_AUTH_RESPONSE});
        dispatch({type: ActionTypes.LOADING});

        RegisterUserService(credentials).then((res) => {
            if(res.hasOwnProperty('success') && res.success === true) {
                localStorage.setItem('user-token', res.token);
                dispatch({type: ActionTypes.SIGNUP_SUCCESS, payload: res});
                history.push('/');
            } else {
                let errMsg = res;
                if(res.hasOwnProperty('username')) {
                    errMsg = res.username[0];
                } else if(res.hasOwnProperty('email')) {
                    errMsg = res.email[0];
                }
                dispatch({type: ActionTypes.SIGNUP_ERROR, payload: errMsg});
            }
        }, error => {
            dispatch({type : ActionTypes.CODE_ERROR, payload: error})
        })
    }
}

export const LoginAction = (credentials, history) => {
    return (dispatch) => {
        dispatch({type: ActionTypes.RESTART_AUTH_RESPONSE});
        dispatch({type: ActionTypes.LOADING});

        LoginUserService(credentials).then((res) => {
            if(res.hasOwnProperty('success') && res.success === true) {
                localStorage.setItem('user-token', res.token);
                dispatch({type: ActionTypes.LOGIN_SUCCESS, payload: res});
                if(res.user.role === "admin") {
                    history.push('/admin');
                } else {
                    history.push('/');
                }
            } else {
                dispatch({type: ActionTypes.LOGIN_ERROR, payload: res});
            }
        }, error => {
            dispatch({type : ActionTypes.CODE_ERROR, payload: error})
        })
    }
}

const isTokenExpired = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  
    const { exp } = JSON.parse(jsonPayload);
    const expired = Date.now() >= exp * 1000
    return expired;
}

export const LogoutAction = (history) => {
    return (dispatch) => {
        console.log('LogoutAction');
        dispatch({type: ActionTypes.RESTART_AUTH_RESPONSE});

        if(localStorage.getItem("user-token")) {
            if(isTokenExpired(localStorage.getItem("user-token"))) {
                dispatch({type: ActionTypes.LOGOUT_SUCCESS, payload: res});
                history.push('/');
            } else {
                LogOutUserService().then((res) => {
                    if(res.hasOwnProperty('success') && res.success === true) {
                        dispatch({type: ActionTypes.LOGOUT_SUCCESS, payload: res});
                        history.push('/');
                    } else if(res.hasOwnProperty('success') && res.success === false) {
                        dispatch({type: ActionTypes.CODE_ERROR, payload: res});
                    }
                }, error => {
                    dispatch({type : ActionTypes.CODE_ERROR, payload: error})
                })                
            }
        } else {
            history.push('/');
        }
    }     
}