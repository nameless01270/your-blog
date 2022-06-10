import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { callAPI } from '../../apis';
import ListViewBlog from '../../components/ListViewBlog';
import { useTitle } from '../../core/customHook';
import { processErrResponse } from '../../redux/actions/browser.action';
import './index.scss';

const UserInfo = () => {
    const { slugUser } = useParams();
    const { browserState: { token } } = useSelector(state => {
        return { browserState: state.browserState }
    })
    const history = useHistory();
    const dispatch = useDispatch();
    const [ userInfo, setUserInfo ] = useState('');
    const [ blogPublic, setBlogPublic ] = useState('');
    

    const getUserInfo = async () => {
        try {
            const getResult = await callAPI('/users/user_info', 'GET', { token }, { user: slugUser }, null);
            await setUserInfo(getResult.data.data);
        }
        catch(err) {
            if(err.response) {
                processErrResponse(history, dispatch, err.response);
            }
        }
    }
    useTitle(userInfo?.name);

    const getBlogPublic = async () => {
        const getResult = await callAPI('/blogs', 'GET', { token }, { user: slugUser }, null);
        await setBlogPublic(getResult.data.data.blogs.filter((blog) => blog.status === 'public'));
    }

    const getData = async () => {
        await getUserInfo();
        await getBlogPublic();
    }

    useEffect(() => {
        getData();
    }, [])
    

    return (
        <div className="user-info">
            <div className="info my-4">
                <div className="d-flex align-items-center flex-column mb-3">
                    <h3>Thông tin cá nhân</h3>
                    <hr/>
                </div>
                <div className='details-info'>
                    <img src={userInfo?.avatar && `${process.env.REACT_APP_URL_BE}/images/image/${userInfo?.avatar}`} alt="avatar"></img>
                    <div>
                        <div className="mt-4"> 
                            <span className="fw-bold">Tên người dùng: </span>
                            <span>{userInfo?.name}</span>
                        </div>
                        <div className="mt-3"> 
                            <span className="fw-bold">Email: </span>
                            <span>{userInfo?.email}</span>
                        </div>
                        <div className="mt-3"> 
                            <span className="fw-bold">Số điện thoại: </span>
                            <span>{userInfo?.phone}</span>
                        </div>
                        <div className="mt-3"> 
                            <span className="fw-bold">Địa chỉ: </span>
                            <span>{userInfo?.address}</span>
                        </div>
                        <div className="mt-3"> 
                            <span className="fw-bold">Quốc gia: </span>
                            <span>{userInfo?.country}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="blogs mt-5">
                <div className="d-flex align-items-center flex-column mb-3">
                    <h3>Blog công khai</h3>
                    <hr/>
                </div>
                {blogPublic.length > 0 ? <ListViewBlog blogs={blogPublic}/> : <p className="text-center fst-italic">Không có bài blog công khai nào</p>}
            </div>
        </div>
    )
}

export default UserInfo;