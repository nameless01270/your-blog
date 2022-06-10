import { Modal, Dropdown } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { callAPI } from "../../apis";
import { processErrResponse } from "../../redux/actions/browser.action";
import { changeTime } from "../../utils/supports";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Comment from '../Comment';
import './index.scss';

const ForumBlog = ({forumBlog, index, onSubmitDelete}) => {
    
    const { browserState: { token }, userState: { userInfo }} = useSelector((state) => {
        return { browserState: state.browserState, userState: state.userState };
    }) 
    const history = useHistory();
    const dispatch = useDispatch();

    const [ blog, setBlog ] = useState(null);
    const [ likes, setLikes ] = useState(null);
    const [ comments, setComments ] = useState(null);

    // get data
    const getData = async () => {
        try {
            const getBlog = await callAPI(`/forum_blogs/${forumBlog._id}`, 'GET', { token }, null, null);
            setBlog(getBlog.data.data);
            const getLikes = await callAPI(`/forum_blogs/${forumBlog._id}/likes`, 'GET', { token }, null, null);
            setLikes(getLikes.data.data);
            const getComments = await callAPI(`/forum_blogs/${forumBlog._id}/comments`, 'GET', { token }, null, null);
            setComments(getComments.data.data);
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    useEffect(() => {
        getData();
    }, [])

    // edit blog
    const [showUpdateBlog, setShowUpdateBlog] = useState(false);
    const [updateResult, setUpdateResult] = useState({message: "", success: true});
    // form validates update
    const validateSchema = yup.object().shape({
        title: yup.string().min(4, "Tối thiểu 4 ký tự").required('Không thể bỏ trống'),
        description: yup.string().min(20, "Tối thiểu 20 ký tự").required('Không thể bỏ trống')
    })
    // use hook form
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({resolver: yupResolver(validateSchema)});
    const handleUpdateClose = () => setShowUpdateBlog(false);
    const handleUpdateShow = () => {
        setShowUpdateBlog(true);
        setUpdateResult({message: "", success: true});
    };

    const onSubmitUpdate = async (data) => {
        try {
            await callAPI(`/forum_blogs/${forumBlog._id}`, 'PUT', { token }, null, data);
            await getData();
            handleUpdateClose();
        }
        catch(err) {
            if(err.response) {
                if(err.response.status === 400) {
                    setUpdateResult({message: err.response.data.message, success: false});
                }
                else {
                    processErrResponse(history, dispatch, err.response);
                }
            }
        }
    }

    // delete blog
    const [showDeleteBlog, setShowDeleteBlog] = useState(false);
    const handleDeleteClose = () => setShowDeleteBlog(false);
    const handleDeleteShow = () =>  setShowDeleteBlog(true);

    // process like or dislike
    const likeOrUnlike = async (type) => {
        try {
            await callAPI(`/forum_blogs/${forumBlog._id}/likes`, 'PUT', { token }, null, {type});
            await getData();
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    // show user like
    const [showUserLike, setShowUserLike] = useState(false);
    const handleUserLikeClose = () => setShowUserLike(false);
    const handleUserLikeShow = () =>  setShowUserLike(true);

    // show comment
    const [ showComment, setShowComment ] = useState(false);

    // submit comment
    const [ dataUploadComment, setDataUploadComment ] = useState("");
    const onSubmitComment = async () => {
        if(dataUploadComment === "") return;
        else {
            try {
                await callAPI(`/forum_blogs/${forumBlog._id}/comments`, 'POST', { token }, null, {content: dataUploadComment});
                setDataUploadComment("");
                const getComments = await callAPI(`/forum_blogs/${forumBlog._id}/comments`, 'GET', { token }, null, null);
                setComments(getComments.data.data);
                document.querySelector('.input-upload-comment textarea').value = "";
            }
            catch(err) {
                if(err.response) processErrResponse(history, dispatch, err.response);
            }
        }
    }
    // update comment
    const onUpdateComment = async (id_comment, content) => {
        try {
            await callAPI(`/forum_blogs/${forumBlog._id}/comments/${id_comment}`, 'PUT', { token }, null, { content });
            const getComments = await callAPI(`/forum_blogs/${forumBlog._id}/comments`, 'GET', { token }, null, null);
            setComments(getComments.data.data);
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    // delete comment
    const onDeleteComment = async (id_comment) => {
        try {
            await callAPI(`/forum_blogs/${forumBlog._id}/comments/${id_comment}`, 'DELETE', { token }, null, null);
            const getComments = await callAPI(`/forum_blogs/${forumBlog._id}/comments`, 'GET', { token }, null, null);
            setComments(getComments.data.data);
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    return (
        <div className="forum-blog box-border my-4">
            <div className="blog-head p-4 d-flex justify-content-between align-items-center">
                <div className="left-blog-head d-flex">
                    <img src={blog?.user.avatar.filename  && `${process.env.REACT_APP_URL_BE}/images/image/${blog?.user?.avatar.filename}`} width={45} heigt={45} alt="user-avatar" onClick={() => history.push(`/${blog?.user.slug}`)}/>
                    <div className="blog-info ms-3">
                        <span className="fw-bold user-name" onClick={() => history.push(`/${blog?.user.slug}`)}>{blog?.user.name}</span><br/>
                        <span className="text-secondary" style={{"fontSize": "14px"}}><i className="fas fa-globe-asia"></i> {changeTime(blog?.created)}</span>
                    </div>  
                </div>
                {userInfo?.slug === blog?.user.slug ?
                <Dropdown align="end">
                    <Dropdown.Toggle>
                        <i className="fas fa-ellipsis-h fs-5"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="box-border">
                        <Dropdown.Item onClick={handleUpdateShow}><span><i className="far fa-edit"></i> Chỉnh sửa bài viết</span></Dropdown.Item>
                        <Dropdown.Item onClick={handleDeleteShow}><span><i className="far fa-trash-alt"></i> Xóa bài viết</span></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                :
                <i className="fas fa-ellipsis-h fs-5 disabled"></i>
                }
            </div>
            <div className="blog-content px-4">
                <h4>{blog?.title}</h4>
                <span style={{"whiteSpace": "pre-line"}}>{blog?.description}</span>
            </div>
            <div className="action-info px-4 py-3 d-flex justify-content-between">
                <span><i className="fas fa-thumbs-up" onClick={async () => { await getData(); handleUserLikeShow() }}></i> {likes?.paging.totalRecords}</span>
                <span>{comments?.paging.totalRecords} bình luận</span>
            </div>
            <hr className="my-0 mx-auto" style={{"width": "95%"}}/>
            <div className="action d-flex justify-content-center py-1">
                {likes?.liked ? <span className="fw-bold text-center" onClick={() => likeOrUnlike('unlike')}><i className="fas fa-thumbs-up"></i> Thích</span>
                :
                <span className="text-center" onClick={() => likeOrUnlike('like')}><i className="far fa-thumbs-up"></i> Thích</span>}
                <span className="text-center" onClick={() => setShowComment(!showComment)}><i className="far fa-comment-alt"></i> Bình luận</span>
            </div>
            <hr className="my-0 mx-auto" style={{"width": "95%"}}/>
            {showComment && 
            <div className="comment px-4 py-3">
                <div className="upload-comment d-flex justify-content-between align-items-center">
                    <img src={userInfo?.avatar  && `${process.env.REACT_APP_URL_BE}/images/image/${userInfo.avatar}`} width={35} height={35} alt="user-avatar"/> 
                    <div className="input-upload-comment"><textarea className="form-control" placeholder="Viết bình luận" onChange={(e) => {setDataUploadComment(e.target.value)}}></textarea></div>
                    <i className="fas fa-paper-plane" onClick={onSubmitComment}></i>
                </div>
                {comments?.comments.length > 0 ? 
                <div className="comment-content">
                    {comments.comments.map((comment, index) => {
                        return <Comment key={index} blog={blog} comment={comment} onUpdateComment={onUpdateComment} onDeleteComment={onDeleteComment}/>
                    })}
                </div>
                :
                <div className="mt-3 text-center">Chưa có bình luận nào</div>}
            </div>}

            <Modal show={showUpdateBlog} onHide={handleUpdateClose} className="form-modal upload-forum-blog">
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmitUpdate)}>
                        <div className="mb-3">
                            <label htmlFor="title">Chủ đề</label>
                            <input {...register('title')} type="text" defaultValue={blog?.title} className={`${errors.title ? "border border-danger" : ""} form-control`} id="title"/>
                            <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.title?.message}</p>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description">Nội dung</label>
                            <textarea {...register('description')} type="text" defaultValue={blog?.description} className={`${errors.description ? "border border-danger" : ""} form-control`} id="description"/>
                            <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.description?.message}</p>
                        </div>
                        <p className={`${updateResult.success ? "text-success" : "text-danger"} text-center fs-6 text-error ps-3 mt-1 mb-3 fst-italic`}>{updateResult.message}</p>
                        <div className="text-center">
                            <button disabled={isSubmitting} type="submit" style={{"width": "100%"}}>Lưu</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={showDeleteBlog} onHide={handleDeleteClose} className="form-modal">
                <Modal.Header className="border-bottom-0" closeButton>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center">Xác nhận xóa bài viết</p>
                    <div className="d-flex justify-content-center pt-3">
                        <button className="btn btn-danger me-3" onClick={() => onSubmitDelete(forumBlog._id, index)}>Xóa</button>
                        <button className="btn btn-secondary" onClick={handleDeleteClose}>Hủy</button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showUserLike} onHide={handleUserLikeClose} className="form-modal">
                <Modal.Header closeButton>
                    <Modal.Title><i className="fas fa-thumbs-up"></i> {likes?.paging.totalRecords} lượt thích</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {likes?.likeUsers.length > 0 ? 
                    <div className="list-like-user">
                        {likes.likeUsers.map((like, index) => {
                            return (
                                <div key={index} className="mb-3">
                                    <img src={like.user.avatar.filename  && `${process.env.REACT_APP_URL_BE}/images/image/${like.user.avatar.filename}`} width={45} heigt={45} alt="user-avatar" onClick={() => history.push(`/${like.user.slug}`)}/>
                                    <span className="fw-bold ms-3 user-name" onClick={() => history.push(`/${like.user.slug}`)}>{like.user.name}</span>
                                </div>
                            )
                        })} 
                    </div>
                    : 
                    <div className="text-center">Chưa có lượt thích nào</div>}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ForumBlog;