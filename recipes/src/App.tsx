import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import React, { Component, Props } from 'react';
import { Provider } from 'react-redux';
import CBKDrawer from './components/Drawer';
import { Grid, Row } from '@material/react-layout-grid';
import List, { ListItem, ListItemText } from '@material/react-list';
import configureStore from 'store/configureStore';
import Recipes from "containers/recipes";
import './styles/app.scss';
import "@material/react-layout-grid/dist/layout-grid.min.css";

function Index() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

const store = configureStore();

class App extends Component<{}, {}> {
  navbarItems: { title: string, path: string, active: boolean }[]

  constructor(props: any) {
    super(props);
    this.navbarItems = [
      { title: 'Recipes', path: '/recipes', active: false },
      { title: 'Planner', path: '/planner', active: false },
      { title: 'Shoplist', path: '/shoplist', active: false },
    ];
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <CBKDrawer>
            {
              this.navbarItems.map((item, i) => (
                <NavLink
                  to={item.path}
                  activeClassName='active'
                  key={i}
                >{item.title}</NavLink>
              ))
            }
          </CBKDrawer>
          <Grid className="cbk-grid">
            <Row>
              <Route path="/recipes" component={Recipes}>
              </Route>
              <Route path="/planner">
              </Route>
              <Route path="/planner">
              </Route>
            </Row>
          </Grid>
        </Router>
      </Provider>
    )
  }
}

export default App;
