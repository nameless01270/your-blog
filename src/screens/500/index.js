import { useTitle } from '../../core/customHook';
import './index.scss';

const Custom500 = () => {
    useTitle("500 Page");

    return (
        <div className={"error_500_page d-flex flex-column align-items-center justify-content-center text-center position-absolute"}>
            <h1 className="text-format-head" data-head="500">500</h1>
            <p className="text-format mt-2" data-p="The server has an error">The server has an error</p>
        </div>
    )
}


export default Custom500;