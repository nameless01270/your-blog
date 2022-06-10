import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoadingPage from './components/LoadingPage';
import SideBar from './components/SideBar';
import Custom404 from './screens/404';
import LoginPage from './screens/Login';
import RegisterPage from './screens/Register';
import Home from './screens/Home';
import Header from './components/Header';
import { useSelector } from 'react-redux';
import ChangePassword from './screens/ChangePassword';
import UpdateUser from './screens/UpdateUser';
import UserInfo from './screens/UserInfo';
import Blogs from './screens/Blogs';
import Friends from './screens/Friends';
import DetailsBlog from './screens/DetailsBlog';
import Custom500 from './screens/500';
import YourForumBlog from './screens/YourForumBlog';
import { useEffect } from 'react';



const App = () => {
  const { browserState: { token, is404, is500, isOpenSideBar } } = useSelector(state => {
    return { browserState: state.browserState }
  })

  return (
    <Router>
      <div className="App">
        <div className="container-fluid p-0">
          {token && !is404 && !is500 && <Header/>}
          {token && !is404 && !is500 && <SideBar/>}
          {
            !is500 ? 
              !is404 ?
              <div className={`${(token) ?  isOpenSideBar ? "isOpen content-page" : "isClose content-page" : ""}`}>
                <Switch>
                  <Route exact path="/update_user_info" component={UpdateUser}/>
                  <Route exact path="/change_password" component={ChangePassword}/>
                  <Route exact path="/login_page" component={LoginPage}/>
                  <Route exact path="/register_page" component={RegisterPage}/>
                  <Route exact path="/blogs_management" component={Blogs}/>
                  <Route exact path="/your_forum_blogs" component={YourForumBlog}/>
                  <Route exact path="/friends_list" component={Friends}/>
                  <Route exact path="/" component={Home}/>
                  <Route exact path="/:slugUser" component={UserInfo}/>
                  <Route exact path="/:slugUser/:slugBlog" component={DetailsBlog}/>
                  <Route exact path="*" component={Custom404}/>
                </Switch>
              </div>
              : <Custom404/>
            : <Custom500/>
          }
        </div>
        <LoadingPage/>
      </div>
    </Router>
  );
}

export default App;
