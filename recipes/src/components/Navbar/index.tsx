import React, { ReactElement } from 'react';
import Button from '@material/react-button';
import './styles.scss';

type NavbarProps = {
  title: string,
  actions?: {
    label: string,
    onClick: () => void,
  }[],
  children?: ReactElement[],
  contentClassName?: string,
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
                <Button unelevated key={i} onClick={action.onClick}>{action.label}</Button>
              ))
            }
          </div>
        ) : null
      }
      <div className={`cbk-navbar__content ${props.contentClassName||''}`}>
        {
          props.children && (
            props.children.map(child => (
              child
            ))
          )
        }
      </div>
    </div>
  );
};
