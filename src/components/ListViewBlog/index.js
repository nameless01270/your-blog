import { useHistory } from "react-router";
import { cutString } from "../../utils/supports";
import "./index.scss";

const ListViewBlog = ({blogs}) => {
    const history = useHistory();
    return (
        <div className="list-view-blog">
            {blogs.map((blog, index) => {
                return (
                    <div className="card" key={index} data-bs-toggle="tooltip" data-bs-placement="right" title={blog.title} onClick={() => history.push(`/${blog.user}/${blog.slug}`)}>
                        <img src={`${process.env.REACT_APP_URL_BE}/images/image/${blog.image}`} className="card-img-top" alt="blog"></img>
                        <div className="card-body">
                            <h5 className="card-title">{cutString(blog.title)}</h5>
                            {blog.status === 'public' ? <p className="card-text"><i className="fas fa-globe-asia"></i><span> Công khai</span></p>
                            : <p className="card-text"><i className="fas fa-lock"></i><span> Riêng tư</span></p>}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ListViewBlog;