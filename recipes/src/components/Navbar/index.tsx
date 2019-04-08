import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './styles.scss';

type LinkItem = {
  title: string,
  path: string,
  active: boolean,
}


type NavbarProps = { 
  items: LinkItem[]
};

function NavbarLink(props: {link: LinkItem}) {
  return (
    <li
      key={props.link.title}
      className={`Navbar__items__links ${props.link.active ? 'Navbar__items__links--active' : ''}`}
    >
      <Link to={props.link.path}>{props.link.title}</Link>
    </li>
  )
}

function Navbar(props: NavbarProps) {
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
          props.items.map((item: any) => <NavbarLink link={item}/>)
        }
          
      </ul>
    </nav>
  );
}

export default Navbar;
