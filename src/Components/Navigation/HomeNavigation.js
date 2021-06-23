import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../../Containers/Login/Login';
import SearchPage from '../../Containers/SearchPage/SearchPage';
import DetailPage from '../../Containers/DetailPage/DetailPage';
import WishlistPage from '../../Containers/WishlishPage/WishlistPage';
import PublicRoute from './PublicRoute';
import Register from '../../Containers/Register/Register';
import HomePage from '../../Containers/HomePage/HomePage';
import NewsPage from '../../Containers/NewsPage/NewsPage';

const UserNavigation = ({match}) => {
  return (
    <Switch>
      <PrivateRoute path={`${match.url}/wishlist`} component={WishlistPage}/>
    </Switch>
  )
}

const HomeNavigation = () => {
  return (
    <Switch>
      <Route exact path='/'><Redirect to='/home'/></Route>
      <PublicRoute path='/home' component={HomePage}/>
      <PublicRoute path='/search' component={SearchPage}/>
      <PublicRoute path='/login' component={Login}/>
      <PublicRoute path='/register' component={Register}/>
      <PublicRoute path='/news' component={NewsPage}/>
      <Route path='/user' component={UserNavigation}/>
      <PublicRoute path='/:id' component={DetailPage}/>
    </Switch>
  );
};

export default HomeNavigation;