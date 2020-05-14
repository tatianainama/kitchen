import { BrowserRouter as Router, Route, Link, NavLink, useRouteMatch, Switch } from "react-router-dom";
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import CBKDrawer from './components/Drawer';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { DrawerAppContent } from '@rmwc/drawer';
import {TopAppBar, TopAppBarRow, TopAppBarNavigationIcon, TopAppBarSection, TopAppBarTitle} from '@rmwc/top-app-bar'
import Toast from 'components/Toast';
import configureStore from 'store/configureStore';
import './styles/app.scss';
import TopBar from 'components/TopAppBar';
import Routes from 'route.config';
import { Display } from "./types/ui";

function Index() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

const store = configureStore();
const { ui } = store.getState();
ui.display
const App = () => {
  return (
    <Provider store={store}>
      <Toast />
      <Router>
        <AppRouterConf {...ui}></AppRouterConf>
      </Router>
    </Provider>
  )
}

const RouteWithSubRoutes = (route: any) => {
  return (
    <Route
      path={route.path}
      render={props => (
        <route.component location={props.location} routes={route.routes} {...props} />
      )}
    />
  );
}

const AppRouterConf: React.FunctionComponent<{ display: Display }> = () => {
  const routes = Routes.filter(route => !!route.title);

  return (
    <>
      //@ts-ignore
      <TopBar routes={routes}/>
      <div className="cbk-app-content">
        <Switch>
          {
            Routes.map((route, i) => {
              return (
                <RouteWithSubRoutes key={i} {...route} />
              )
            })
          }
        </Switch>
      </div>
    </>
  );
}

export default App;
