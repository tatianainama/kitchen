import React, { ReactElement } from 'react';
import { Button } from '@rmwc/button';

import '@rmwc/button/styles';
import './styles.scss';

type NavbarProps = {
  title: string,
  actions?: {
    label: string,
    onClick: () => void,
  }[],
  children?: ReactElement | ReactElement[],
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
          props.children && React.Children.map(props.children, child => child )
        }
      </div>
    </div>
  );
};
