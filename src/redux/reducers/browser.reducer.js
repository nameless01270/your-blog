import { SET_IS_404, SET_IS_500, SET_IS_OPEN_SIDE_BAR, SET_TOKEN } from "../constants";

const browserInitState = {
    token: localStorage.getItem('token-yb') || false,
    is404: false,
    is500: false,
    isOpenSideBar: localStorage.getItem('isOpenSideBar-yb') ? localStorage.getItem('isOpenSideBar-yb') === 'false' ? false : true : true
}


const handleBrowserState = (state =  browserInitState, action) => {
    switch(action.type) {
        case SET_TOKEN: {
            return {
                ...state,
                token: action.payload
            }
        }
        case SET_IS_404: 
            return {
                ...state,
                is404: action.payload
            }
        case SET_IS_500: 
            return {
                ...state,
                is500: action.payload
            }
        case SET_IS_OPEN_SIDE_BAR:
            return {
                ...state,
                isOpenSideBar: action.payload
            }
        default:
            return state;
    }
}

export default handleBrowserState;