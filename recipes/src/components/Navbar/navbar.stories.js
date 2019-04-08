import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { storiesOf } from '@storybook/react';

import Navbar from './index';

const navbarItems = [
  { title: 'home', path: '/' },
  { title: 'recipes', path: '/recipes' },
  { title: 'planner', path: '/planner' },
  { title: 'shoplist', path: '/shoplist' },
];

storiesOf('Navbar', module)
  .add('default', () => (
    <Router>
      <Navbar items={navbarItems}></Navbar>
    </Router>
  ))