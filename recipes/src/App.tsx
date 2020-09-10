import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from 'react';
import { Provider } from 'react-redux';
import Toast from 'components/Toast';
import configureStore from 'store/configureStore';
import TopBar from 'components/TopAppBar';
import Routes, { navbarRoutes } from 'route.config';
import { Display } from "./types/ui";

import './styles/app.scss';


const store = configureStore();
const { ui } = store.getState();

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
        <route.component routes={route.routes} {...props} />
      )}
    />
  );
}

const AppRouterConf: React.FunctionComponent<{ display: Display }> = () => {
  const routes = navbarRoutes;
  return (
    <>
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
