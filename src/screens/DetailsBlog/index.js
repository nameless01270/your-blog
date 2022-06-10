import { Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { callAPI } from '../../apis';
import { changeTime } from '../../utils/supports';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import './index.scss';
import { useTitle } from '../../core/customHook';
import { processErrResponse } from '../../redux/actions/browser.action';

const DetailsBlog = () => {
    const { slugUser, slugBlog } = useParams();
    const { browserState: { token }, userState: { userInfo }} = useSelector(state => {
        return { browserState: state.browserState, userState: state.userState }
    })
    const history = useHistory();
    const dispatch = useDispatch();
    const [ blog, setBlog ] = useState('');
    useTitle(blog?.title);
    const getBlog = async (slug_blog) => {
        try{
            const result = await callAPI(`/blogs/${slug_blog}`, 'GET', { token }, { user: slugUser }, null);
            setBlog(result.data.data);
        }
        catch(err){
            if(err.response) {
                processErrResponse(history, dispatch, err.response);
            }
        }
    }

    useEffect(() => {
        getBlog(slugBlog);
    }, []);

    const [showUpdateBlog, setShowUpdateBlog] = useState(false);
    const [ updateResult, setUpdateResult ] = useState({message: "", success: true});
    const [showDeleteBlog, setShowDeleteBlog] = useState(false);
    // form validates update
    const validateSchema = yup.object().shape({
        title: yup.string().min(4, "Tối thiểu 4 ký tự").required('Không thể bỏ trống'),
        status: yup.string(),
        description: yup.string().min(20, "Tối thiểu 20 ký tự").required('Không thể bỏ trống')
    })
    // use hook form
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({resolver: yupResolver(validateSchema)});
    const handleUpdateClose = () => setShowUpdateBlog(false);
    const handleUpdateShow = () => {
        setShowUpdateBlog(true);
        reset();
        setUpdateResult({message: "", success: true});
    };

    const handleDeleteClose = () => setShowDeleteBlog(false);
    const handleDeleteShow = () =>  setShowDeleteBlog(true);

    const onSubmitUpdate = async (data) => {
        try{
            const resultUpdate = await callAPI(`/blogs/${slugBlog}`, 'PUT', { token }, null, data);
            history.replace(`/${slugUser}/${resultUpdate.data.data.slug}`);
            await getBlog(resultUpdate.data.data.slug);
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

    const onSubmitDelete = async () => {
        try{
            await callAPI(`/blogs/${slugBlog}`, 'DELETE', { token }, null, null);
            history.push('/blogs_management');
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    const onSubmitChangeImage = () => {
        
    };

    return (
        <div className="view-details-blog">
            <div className="mt-5 p-4">
                <div className="title">
                    <div>
                        <h3>{blog?.title}</h3>
                        <span className="fs-6 fst-italic">{blog?.status === 'public' ? "Công khai" : "Riêng tư"}</span><br/>
                        <span>Ngày đăng: {changeTime(blog?.created)}</span><br/>
                        {blog?.updated && <span>Ngày chỉnh sửa gần nhất: {changeTime(blog?.updated)}</span>}
                        {slugUser === userInfo.slug && <div className="action-blog mt-2">
                            <i className="fas fa-edit" data-bs-toggle="tooltip" data-bs-placement="right" title="Chỉnh sửa" onClick={handleUpdateShow}></i>
                            <i className="fas fa-trash-alt" data-bs-toggle="tooltip" data-bs-placement="right" title="Xóa" onClick={handleDeleteShow}></i>
                        </div>}
                    </div>
                    
                    {/*Phần thêm */}
                    <div class="image-upload">
                        <label for="file-input">
                            <img src={blog?.image && `${process.env.REACT_APP_URL_BE}/images/image/${blog.image}`} className="card-img-top" alt="blog" data-bs-toggle="tooltip" data-bs-placement="right" title="Đổi image" onChange={(e) => onSubmitChangeImage(e.target.value)} data-bs-delay="0"></img>
                        </label>

                        <input id="file-input" type="file" />
                    </div>                    

                    {/* <img src={ blog?.image && `${process.env.REACT_APP_URL_BE}/images/image/${blog.image}`} className="card-img-top" alt="blog"></img> */}

                </div>
                <hr/>
                <div className="description">
                    {blog?.description}
                </div>
            </div>
            <Modal show={showUpdateBlog} onHide={handleUpdateClose} size="lg" className="form-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật thông tin bài blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmitUpdate)}>
                        <div className="mb-3">
                            <label htmlFor="title">Chủ đề</label>
                            <input {...register('title')} type="text" defaultValue={blog?.title} className={`${errors.title ? "border border-danger" : ""} form-control`} id="title"/>
                            <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.title?.message}</p>
                        </div>
                        <div className="mb-3">
                            <select {...register('status')} defaultValue={blog?.status}  className="form-select" aria-label="Default select example">
                                <option value="public">Công khai</option>
                                <option value="private">Riêng tư</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description">Nội dung</label>
                            <textarea {...register('description')} type="text" defaultValue={blog?.description} className={`${errors.description ? "border border-danger" : ""} form-control`} id="description"/>
                            <p className="text-error text-danger ps-3 my-1 fst-italic">{errors.description?.message}</p>
                        </div>
                        <p className={`${updateResult.success ? "text-success" : "text-danger"} text-center fs-6 text-error ps-3 mt-1 mb-3 fst-italic`}>{updateResult.message}</p>
                        <div className="text-center">
                            <button disabled={isSubmitting} type="submit">Cập nhật</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={showDeleteBlog} onHide={handleDeleteClose} className="form-modal">
                <Modal.Header className="border-bottom-0" closeButton>
                </Modal.Header>
                <Modal.Body>

                    <p className="text-center">Xác nhận xóa bài blog "{blog?.title}"</p>
                    <div className="d-flex justify-content-center pt-3">
                        <button className="btn btn-danger me-3" onClick={onSubmitDelete}>Xóa</button>
                        <button className="btn btn-secondary" onClick={handleDeleteClose}>Hủy</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DetailsBlog;
