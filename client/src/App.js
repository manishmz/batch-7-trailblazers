import React, { useState } from 'react';
import './App.css';
import {
  Switch,
  Redirect,
  withRouter
} from 'react-router-dom';
import Login from './views/Login';
import Signup from './components/SignUp';
import SnackBarProvider from './context/SnackBarProvider';
import DashBoard from './components/Dashboard/Dashboard';
import Header from './components/Header/Header';
import BoardDetails from './components/Board/BoardDetails';
import MemberList from './components/Board/Settings/MembersList';
import PrivateRoute, { Auth } from './components/PrivateRoute/PrivateRoute';
import { Icon, Popover, List, ListItem, ListItemText } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import Cookies from 'js-cookie';

function App(props) {
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [userName, setUserName] = useState('');
  const openProfile = Boolean(profileAnchorEl);
  const isLogin = props.location.pathname === '/login';
  const handleProfileClick = function(event) {
    setProfileAnchorEl(event.currentTarget);
    if(Cookies.get('issue_tracker_user')) {
      console.log(Cookies.get('issue_tracker_user'));
      const user = JSON.parse(Cookies.get('issue_tracker_user'));
      setUserName(user.name);
    } 
  }
  
  const logOut = () => {
    Auth.logout();
    setProfileAnchorEl(null);
  }
  
  return (
    <ThemeProvider theme={theme}>
      <SnackBarProvider>
        <Header name="IsTrack" >
          {isLogin ? <label></label> : (<Icon style={{fontSize: 30, float: 'right', cursor: 'pointer'}} 
          onClick={handleProfileClick}>account_circle
          </Icon>)}
        <Popover
            open={openProfile}
            onClose={()=> {
              setProfileAnchorEl(null);
            }}
            anchorEl = {profileAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <List component="nav">
              <ListItem>
                <ListItemText primary={userName}/>
              </ListItem>
              <ListItem onClick={logOut} button>
                <ListItemText primary="Logout"/>
              </ListItem>
            </List>
        </Popover>
        </Header>
      
        <div className="app-body">
            <Switch>
              <PrivateRoute exact path="/login" component={Login} />
              <PrivateRoute exact path="/signup" component={Signup} />
              <PrivateRoute exact path="/dashboard" component={DashBoard} />
              <PrivateRoute
                exact
                path="/boarddetails/:id"
                component={BoardDetails}
              />
              <PrivateRoute
                exact
                path="/boarddetails/setting/:id"
                component={MemberList}
              />
              <Redirect from="/" to="/login" />
            </Switch>
        </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
      </SnackBarProvider>
    </ThemeProvider>
  );
}

export default withRouter(App);
