import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import './Navbar.css';
import logo from '../../Assets/images/logo.png'
import { Grid, TextField } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { fetchCurrentUser, signOut } from '../../firebase';
import { AccountCircleOutlined, AccountCircleTwoTone } from '@material-ui/icons';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import SearchBar from '../SearchBar/SearchBar';
import CategoriesSelect from '../CategoriesSelect/CategoriesSelect';
import qs from 'query-string';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCurrentUser = await fetchCurrentUser();
      setCurrentUser(fetchedCurrentUser);
    }
    fetchData();
  }, [location]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    history.push('/login');
  }

  const renderLoginPrompt = () => {
    const messageAndPrompt = {
      login: {
        message: 'Belum memiliki akun?',
        prompt: 'Daftar',
        style: {
          margin: '0 10px'
        },
        redirect: ['/register', '/register']
      },
      register: {
        message: 'Sudah memiliki akun?',
        prompt: 'Login',
        style: {
          margin: '0 10px'
        },
        redirect: ['/login', '/login']
      },
      loggedIn: {
        message: 'Daftar',
        prompt: 'Login',
        style: {
          margin: '0 10px',
          cursor: 'pointer'
        },
        redirect: ['/register', '/login']
      }
    }

    const renderMenuMessageAndPrompt = () => {
      const { pathname } = location;
      const { login, register, loggedIn } = messageAndPrompt;
      if (pathname === '/login') {
        return login;
      } else if (pathname === '/register') {
        return register;
      } else {
        return loggedIn;
      }
    }

    return (
      <div className='navbar-menu'>
        <div
          style={renderMenuMessageAndPrompt().style}
          onClick={() => history.push(renderMenuMessageAndPrompt().redirect[0])}
        >
          <h5>{renderMenuMessageAndPrompt().message}</h5>
        </div>
        <div className='login-prompt-btn'
          onClick={() => history.push(renderMenuMessageAndPrompt().redirect[1])}
        >
          <h5>{renderMenuMessageAndPrompt().prompt}</h5>
        </div>
      </div>
    )
  }

  const renderNavbarMenu = () => {
    return (
      <div className='navbar-menu'>
        <div className='item' onClick={() => history.push('/user/wishlist')}>
          <FavoriteBorderIcon style={{fontSize: '28px'}}/>
        </div>
        <div>
          <div className='item' onClick={handleProfileClick}>
            <PersonOutlineIcon style={{fontSize: '28px'}}/>
          </div>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <div style={{margin: '0 20px 0 20px'}}>
              <Grid container>
                <Grid item xs={3}>
                  <div style={{margin: '20px 0 0 0'}}>
                    <AccountCircleTwoTone fontSize='large'/>
                  </div>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={7}>
                  <div className='text-no-margin'>
                    <h5>{!!currentUser ? currentUser.username : '-'}</h5>
                  </div>
                </Grid>
              </Grid>
            </div>
            <StyledMenuItem onClick={() => handleLogout()}>
              <ListItemText primary="Keluar" />
              <ListItemIcon/>
            </StyledMenuItem>
          </StyledMenu>
        </div>
      </div>
    )
  }

  const handleSearch = (searchString) => {
    history.push({
      search: `?query=${searchString.replace('&', '%26')}`,
      pathname: '/search/'
    });
  }

  return (
    <>
    <div class="navbar-full-wrapper">
      <div class="navbar-wrapper">
        <div style={{display: 'flex'}}>
          <div style={{width: '30%', marginRight: '10px'}}>
            <img
              src={logo}
              alt='logo'
              style={{cursor: 'pointer', height: '30px', marginTop: '12px'}}
              onClick={() => {history.push('/home')}}
            />
          </div>
          <SearchBar handleSearch={(value) => handleSearch(value)}/>
          {
            location.pathname==='/login' ||
            location.pathname==='/register' ?
            <></> :
            <div style={{width: '15%'}}></div>
          }
          <div
            style={{
              width: `${
                location.pathname==='/login' ||
                location.pathname==='/register' ?
                '50%' : '35%'
              }`,
              marginLeft: '20px'
            }}
          >
            {
              !!currentUser &&
              !(location.pathname==='/login' ||
              location.pathname==='/register') ?
                renderNavbarMenu() : renderLoginPrompt()
            }
          </div>
        </div>
      </div>
      <div class="navbar-wrapper">
        <div style={{display: 'flex'}}>
          <CategoriesSelect/>
        </div>
      </div>
    </div>
    </>
  )
}

export default Navbar;