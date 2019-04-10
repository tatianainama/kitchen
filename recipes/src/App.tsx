import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import React, { Component, Props } from 'react';
import CBKDrawer from './components/Drawer';
import List, {ListItem, ListItemText} from '@material/react-list';

import './styles/app.scss';

function Index() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

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
      </Router>
    )
  }
}

export default App;
