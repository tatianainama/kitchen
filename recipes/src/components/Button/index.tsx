import React, { ReactElement } from 'react';
import Icon from 'components/Icon';
import IconButton from '@material/react-icon-button';

import classnames from 'classnames';

import '@material/react-button/dist/button.css';
import '@material/react-icon-button/dist/icon-button.css'

import './styles.scss';

type CBKButtonProps = {
  children?: string|ReactElement,
  className?: string,
  unelevated?: boolean,
  raised?: boolean,
  outlined?: boolean,
  icon?: string,
  onClick?: (e: any) => void,
  small?: boolean,
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean
  style?: any;
}

export default function CBKButton(props: CBKButtonProps) {
  const btnClassNames = classnames({
    'cbk-btn': true,
    'cbk-btn--raised': props.raised,
    'cbk-btn--unelevated': props.unelevated,
    'cbk-btn--outlined': props.outlined,
    'cbk-btn--disabled': props.disabled,
    'cbk-btn--small': props.small,
  })
  if (props.icon) {
    return (
      <IconButton
        onClick={props.onClick}
        unelevated={props.unelevated}
        raised={props.raised}
        outlined={props.outlined}
        className={classnames({
          'btn-small': props.small,
        }, props.className)}
        type={props.type || 'button'}
        disabled={props.disabled}
        style={props.style}
      >
        <Icon material icon={props.icon}/>
      </IconButton>
    );
  } else {
    return (
      <button
        disabled={props.disabled}
        className={btnClassNames}
        onClick={props.onClick}
        style={props.style}
        type={props.type || 'button'}
      >
        { props.children }
      </button>
    )
  }
};