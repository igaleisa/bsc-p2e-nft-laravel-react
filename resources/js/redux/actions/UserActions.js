import * as ActionTypes from '../ActionTypes';
import {RegisterUserService, LoginUserService, LogOutUserService} from '../../services/AuthServices';

export const RegisterAction = (credentials) => {
    return (dispatch) => {
        dispatch({type: ActionTypes.RESTART_AUTH_RESPONSE});
        dispatch({type: ActionTypes.LOADING});

        RegisterUserService(credentials).then((res) => {
            if(res.hasOwnProperty('success') && res.success === true) {
                dispatch({type: ActionTypes.SIGNUP_SUCCESS, payload: res});
            } else if(res.hasOwnProperty('success') && res.success === false) {
                dispatch({type: ActionTypes.SIGNUP_ERROR, payload: res});
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
                localStorage.setItem('user-token', res.token)
                dispatch({type: ActionTypes.LOGIN_SUCCESS, payload: res});
                if(res.user.role === "admin") {
                    history.push('/admin');
                } else {
                    history.push('/');
                }
            } else if(res.hasOwnProperty('error') && res.error !== ""){
                dispatch({type: ActionTypes.LOGIN_ERROR, payload: res});
            }
        }, error => {
            dispatch({type : ActionTypes.CODE_ERROR, payload: error})
        })
    }
}
export const LogoutAction = () => {
    return (dispatch) => {
        dispatch({type: ActionTypes.RESTART_AUTH_RESPONSE});
        LogOutUserService().then((res) => {
            if(res.hasOwnProperty('success') && res.success === true) {
                dispatch({type: ActionTypes.LOGOUT_SUCCESS, payload: res});
            } else if(res.hasOwnProperty('success') && res.success === false) {
                dispatch({type: ActionTypes.LOGOUT_SUCCESS, payload: res});
            }
        }, error => {
            dispatch({type : ActionTypes.CODE_ERROR, payload: error})
        })
    }
}