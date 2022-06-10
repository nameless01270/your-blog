import { Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { callAPI } from '../../apis';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import './index.scss';
import { useTitle } from '../../core/customHook';
import { processErrResponse } from '../../redux/actions/browser.action';
import ForumBlog from '../../components/ForumBlog';

const Home = () => {
    useTitle("Trang chủ");
    const { browserState: { token }, userState: { userInfo } } = useSelector(state => {
        return { browserState: state.browserState , userState: state.userState};
    })
    const history = useHistory();
    const dispatch = useDispatch();

    // get forum blogs ( phần chỉnh sửa)
    const [ forumBlogs, setForumBlogs ] = useState('');
    const [ pagingBlogs, setPagingBlogs ] = useState({});
    // get forum blogs
    const getForumBlogs = async () => {
        try {
            const result = await callAPI('/forum_blogs', 'GET', {token}, null, null);
            setForumBlogs(result.data.data.forumBlogs);
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    useEffect(() => {
        getForumBlogs();
    }, [])

    // giữ nguyên
    const [showUploadBlog, setShowUploadBlog] = useState(false);
    const [uploadResult, setUploadResult] = useState({message: "", success: true});
    // form validates update
    const validateSchema = yup.object().shape({
        title: yup.string().min(4, "Tối thiểu 4 ký tự").required('Không thể bỏ trống'),
        description: yup.string().min(20, "Tối thiểu 20 ký tự").required('Không thể bỏ trống')
    })
    // use hook form
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({resolver: yupResolver(validateSchema)});
    const handleUploadClose = () => setShowUploadBlog(false);
    const handleUploadShow = () => {
        setShowUploadBlog(true);
    };

    const onSubmitUpload = async (data) => {
        try {
            const uploadBlog = await callAPI('/forum_blogs', 'POST', { token }, null, data);
            const saveBlogs = forumBlogs;
            await setForumBlogs([]);
            await setForumBlogs([uploadBlog.data.data, ...saveBlogs]);
            handleUploadClose();
            reset();
        }
        catch(err) {
            if(err.response) {
                if(err.response.status === 400) {
                    setUploadResult({message: err.response.data.message, success: false});
                }
                else {
                    processErrResponse(history, dispatch, err.response);
                }
            }
        }
    }

    const onSubmitDelete = async (id_blog, index) => {
        try {
            await callAPI(`/forum_blogs/${id_blog}`, 'DELETE', { token }, null, null);
            const saveBlogs = forumBlogs;
            await setForumBlogs([]);
            await setForumBlogs([...saveBlogs.slice(0, index), ...saveBlogs.slice(index + 1)]);
        }
        catch(err) {
            if(err.response) {
                processErrResponse(history, dispatch, err.response);
            }
        }
    }

    return (
        <>
        <div className="home">
            <button className="your-forum-blog-btn" onClick={() => history.push('/your_forum_blogs')}>Bài viết của bạn</button>
            <div className="upload-blog mt-4 box-border p-4">
                <img src={userInfo?.avatar  && `${process.env.REACT_APP_URL_BE}/images/image/${userInfo.avatar}`} width={45} height={45} alt="user-avatar"/>
                <div className="ms-3" onClick={handleUploadShow}><input className="form-control" placeholder="Đăng bài viết" disabled></input></div>
            </div>
            
            {forumBlogs.length > 0 ? 
            <div className="forum-blogs">
                {forumBlogs.map((blog, index) => <ForumBlog forumBlog={blog} key={index} index={index} onSubmitDelete={onSubmitDelete}/>)}
            </div>
            : 
            <div className="no-blogs mt-4 box-border text-center py-3">
                Chưa có bài đăng nào!
            </div>}
            
            <Modal show={showUploadBlog} onHide={handleUploadClose} className="form-modal upload-forum-blog">
                <Modal.Header closeButton>
                    <Modal.Title>Tạo bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmitUpload)}>
                        <div className="mb-3">
                            <label htmlFor="title">Chủ đề</label>
                            <input {...register('title')} type="text" className={`${errors.title ? "border border-danger" : ""} form-control`} id="title"/>
                            <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.title?.message}</p>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description">Nội dung</label>
                            <textarea {...register('description')} type="text" className={`${errors.description ? "border border-danger" : ""} form-control`} id="description"/>
                            <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.description?.message}</p>
                        </div>
                        <p className={`${uploadResult.success ? "text-success" : "text-danger"} text-center fs-6 text-error ps-3 mt-1 mb-3 fst-italic`}>{uploadResult.message}</p>
                        <div className="text-center">
                            <button disabled={isSubmitting} type="submit" style={{"width": "100%"}}>Đăng bài</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
        </>
    )
}

export default Home;