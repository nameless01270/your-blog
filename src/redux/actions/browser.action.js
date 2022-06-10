import { SET_IS_404, SET_TOKEN, SET_IS_OPEN_SIDE_BAR, SET_IS_500 } from "../constants"

export const actSetLogin = (payload) => {
    return {
        type: SET_TOKEN,
        payload
    }
}

export const actSetIs404 = (payload) => {
    return {
        type: SET_IS_404,
        payload
    }
}

export const actSetIs500 = (payload) => {
    return {
        type: SET_IS_500,
        payload
    }
}

export const actSetIsOpenSideBar = (payload) => {
    localStorage.setItem('isOpenSideBar-yb', payload);
    return {
        type: SET_IS_OPEN_SIDE_BAR,
        payload
    }
}


export const redirectToLogin = async (history, dispatch) => {
    await dispatch(actSetLogin(""));
    localStorage.removeItem('token-yb');
    localStorage.removeItem('isOpenSideBar-yb');
    history.push('/login_page');
}

export const processErrResponse = async (history, dispatch, response) => {
    switch(response.status) {
        case 401: 
            return redirectToLogin(history, dispatch);
        case 404:
            return dispatch(actSetIs404(true));
        case 500: 
            return dispatch(actSetIs500(true));
        default: 
            return
    }
}
