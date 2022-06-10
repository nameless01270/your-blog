import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { actSetIsOpenSideBar, processErrResponse, redirectToLogin } from "../../redux/actions/browser.action";
import "./index.scss";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { callAPI } from "../../apis";
import { actSetUserInfo } from "../../redux/actions/user.action";


const Header = () => {
    const { browserState: { isOpenSideBar, token }, userState: { userInfo }} = useSelector(state => {
        return { browserState: state.browserState, userState: state.userState }
    })
    const history = useHistory();
    const dispatch = useDispatch();

    const getUser = async () => {
        try {
            const userInfo = await callAPI('/users/user_info', "GET", {token}, null, null);;
            await dispatch(actSetUserInfo(userInfo.data.data));
        }
        catch(err) {
            if(err.response) {
                processErrResponse(history, dispatch, err.response);
            }
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    const logout = async () => {
        try {
            await callAPI('/logout', 'POST', {token}, null, null);
            redirectToLogin(history, dispatch);
        }
        catch(err) {
            if(err.response) alert(err.response.data.message);
        }
    }

    return(
        <div className="header position-fixed d-flex justify-content-between align-items-center bg-white px-4 border-bottom">
            <div className="left-header d-flex align-items-center">
                <span className="icon-header me-4" onClick={() => dispatch(actSetIsOpenSideBar(!isOpenSideBar))}><i className={isOpenSideBar ? "fas fa-outdent" : "fas fa-bars"}></i></span>
                <span className="text-format-head fs-4" data-head="Your Blog">Your Blog</span>
                <div className="d-flex search-header ms-4">
                    <i className="fas fa-search"></i>
                    <input className="form-control" placeholder="Tìm kiếm" onChange={() => {}}></input>
                </div>
            </div>
            <div className="right-header d-flex align-items-center">
                <span className="icon-header me-3"><i className="fas fa-bell"></i></span>
                <Dropdown align="end">
                    <Dropdown.Toggle>
                        <img className="icon-user-menu user-image me-2" src={userInfo?.avatar  && `${process.env.REACT_APP_URL_BE}/images/image/${userInfo.avatar}`} alt="user-avatar"></img>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="box-border">
                        <Dropdown.Item onClick={() => {history.push(`/${userInfo?.slug}`)}}>
                            <img className="user-image me-2" src={userInfo?.avatar  && `${process.env.REACT_APP_URL_BE}/images/image/${userInfo.avatar}`} alt="user-avatar"></img>
                            <span>{userInfo.name}</span>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => {history.push(`/update_user_info`)}}>
                            <i className="ps-2 me-2 fas fa-user"></i>
                            <span>Cập nhật thông tin</span>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => {history.push(`/change_password`); getUser()}}>
                            <i className="ps-2 me-2 fas fa-key"></i>
                            <span>Đổi mật khẩu</span>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={logout}>
                            <i className="ps-2 me-2 fas fa-sign-out-alt"></i>
                            <span>Đăng xuất</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default Header;