import logo from '../../public/image/loading.svg';
import './index.scss';

const LoadingPage = () => {
    return (
        <div className="loading-page">
            <img src={logo} className="logo-loading" alt="logo" />
        </div>
    )
}

export default LoadingPage;