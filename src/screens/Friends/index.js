import { useSelector } from 'react-redux';
import { useTitle } from '../../core/customHook';
import './index.scss';

const Friends = () => {
    useTitle("Bạn bè");
    const { browserState: {  } } = useSelector(state => {
        return { browserState: state.browserState }
    })

    

    return (
        <div className="friends">
            Friends
        </div>
    )
}

export default Friends;