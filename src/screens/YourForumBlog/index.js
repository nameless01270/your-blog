import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { callAPI } from '../../apis';
import './index.scss';
import { useTitle } from '../../core/customHook';
import { processErrResponse } from '../../redux/actions/browser.action';
import ForumBlog from '../../components/ForumBlog';

const YourForumBlog = () => {
    useTitle("Bài viết của bạn");
    const { browserState: { token }, userState: { userInfo } } = useSelector(state => {
        return { browserState: state.browserState , userState: state.userState};
    })
    const history = useHistory();
    const dispatch = useDispatch();

    // get forum blogs
    const [ blogs, setBlogs ] = useState([]);
    const [ pagingBlogs, setPagingBlogs ] = useState({});
    const getBlogs = async () => {
        try {
            const result = await callAPI('/forum_blogs', 'GET', {token}, { type: "user" }, null);
            setBlogs(result.data.data.forumBlogs);
            setPagingBlogs(result.data.data.paging);
        }
        catch(err) {
            if(err.response) processErrResponse(history, dispatch, err.response);
        }
    }

    const loadData = async () => {
        await setBlogs([]);
        await getBlogs();
    }

    useEffect(() => {
        getBlogs();
    }, [])

    return (
        <>
        <div className="your-forum-blog">
            <h3 className="mt-3 text-center">Bài viết đã đăng</h3>
            <hr/>
            {blogs.length > 0 ? 
            <div className="forum-blogs">
                {blogs.map((blog, index) => <ForumBlog forumBlog={blog} loadData={loadData} key={index}/>)}
            </div>
            : 
            <div className="no-blogs mt-4 box-border text-center py-3">
                Bạn chưa đăng bài viết nào!
            </div>}
        </div>
        </>
    )
}

export default YourForumBlog;