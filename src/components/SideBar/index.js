import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import './index.scss';

const SideBar = () => {
    const { browserState: { isOpenSideBar } } = useSelector(state => {
        return { browserState: state.browserState }
    })

    return(
        <div className={`${isOpenSideBar ? "isOpenSideBar" : "isCloseSideBar"} left-menu position-fixed`}>
            <ul className="nav nav-pills flex-column mb-auto">
                <li>
                    <NavLink exact to='/' className={`${isOpenSideBar ? "isShow" : "isHide"} p-2 text-decoration-none`} data-bs-toggle={isOpenSideBar ? "" : "tooltip"} data-bs-placement="right" title="Trang chủ">
                        <span><i className="fas fa-home me-2"></i>Trang chủ</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to='/blogs_management' className={`${isOpenSideBar ? "isShow" : "isHide"} p-2 text-decoration-none`} data-bs-toggle={isOpenSideBar ? "" : "tooltip"} data-bs-placement="right" title="Blog cá nhân">
                        <span><i className="fas fa-blog me-2"></i>Blog cá nhân</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to='/friends_list' className={`${isOpenSideBar ? "isShow" : "isHide"} p-2 text-decoration-none`} data-bs-toggle={isOpenSideBar ? "" : "tooltip"} data-bs-placement="right" title="Bạn bè">
                        <span><i className="fas fa-user-friends me-2"></i>Bạn bè</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default SideBar;