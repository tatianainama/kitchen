import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import React, { Component, Props } from 'react';
import { Provider } from 'react-redux';
import CBKDrawer from './components/Drawer';
import Toast from 'components/Toast';
import configureStore from 'store/configureStore';
import './styles/app.scss';

import Routes, { RouteWithSubRoutes } from 'route.config';

function Index() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

const store = configureStore();

const App = () => {
  const navbarItems = [
    { title: 'Recipes', path: '/recipes', active: false },
    { title: 'Planner', path: '/planner', active: false },
    { title: 'Shoplist', path: '/shoplist', active: false },
  ];
  return (
    <Provider store={store}>
      <Toast />
      <Router>
        <div className="cbk-app-drawer">
        <CBKDrawer>
          {
            navbarItems.map((item, i) => (
              <NavLink
                to={item.path}
                activeClassName='active'
                key={i}
              >{item.title}</NavLink>
            ))
          }
        </CBKDrawer>
        </div>
        <div className="cbk-main">
          {
            Routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))
          }
        </div>
      </Router>
    </Provider>
  )
}

export default App;
