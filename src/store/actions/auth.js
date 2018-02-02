import * as actionTypes from "./actionTypes"
import axios from "axios";
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const setAuthRedirectPath = path => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }

}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }

}

export const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime')
    localStorage.removeItem('userId')
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logOut())
        }, expirationTime * 1000)
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart())
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDX0xNcIWl1IHejV7ae5RCv56R0_TcMJEs";
        if(!isSignup) {
            url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDX0xNcIWl1IHejV7ae5RCv56R0_TcMJEs";
        }
        axios.post(url, authData)
        .then(response =>{
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000)
            localStorage.setItem('token', response.data.idToken)
            localStorage.setItem('expirationTime', expirationDate)
            localStorage.setItem('userId', response.data.localId)
            dispatch(authSuccess(response.data.idToken, response.data.localId))
            dispatch(checkAuthTimeout(response.data.expiresIn))
        })
        .catch(err => {
            dispatch(authFail(err.response.data.error))
        })
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token')
        if(!token) {
            dispatch(logOut())
        }
        else {
            const expirationTime = new Date(localStorage.getItem('expirationTime'))
            if(expirationTime > new Date()){
                const userId = localStorage.getItem('userId')
                dispatch(authSuccess(token, userId))
                dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime())/1000))
            }
            else{
                dispatch(logOut())
            }
            
        }
    }
}