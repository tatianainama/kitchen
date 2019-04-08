import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './styles.scss';

type Props = {
  items: {
    title: string,
    path: string,
  }[]
}

function Navbar(props: Props) {
  return (
    <nav
      className='Navbar'
    >
      <ul className='Navbar__items'>
        <li
          key='brand'
          className='Navbar__brand'
        >
          <h1>Cookbook</h1>
        </li>
        {
          props.items.map((item: any) => (
            <li 
              key={item.title}
              className='Navbar__items__links'
            >
              <Link to={item.path}>{item.title}</Link>
            </li>
          ))
        }
      </ul>
    </nav>
  );
}

export default Navbar;
