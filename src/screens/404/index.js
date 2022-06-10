import { useTitle } from '../../core/customHook';
import './index.scss';

const Custom404 = () => {
    useTitle("404 Page");

    return(
        <div className={"error_404_page d-flex flex-column align-items-center justify-content-center text-center position-absolute"}>
            <h1 className="text-format-head" data-head="404">404</h1>
            <p className="text-format mt-2" data-p="This page could not be found">This page could not be found</p>
        </div>
    )
}

export default Custom404;