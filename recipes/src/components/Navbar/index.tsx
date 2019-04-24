import React from 'react';
import './styles.scss';

type NavbarProps = {
  title: string,
  actions?: {
    label: string,
    onClick: () => void,
  }[]
}
export default function Navbar(props: NavbarProps){
  return (
    <div className='cbk-navbar'>
      <div>
        <h4>{props.title}</h4>
      </div>
      {
        props.actions ? (
          <div>
            {
              props.actions.map((action, i) => (
                <button key={i} onClick={action.onClick}>{action.label}</button>
              ))
            }
          </div>
        ) : null
      }
    </div>
  );
};
