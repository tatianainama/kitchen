import React, { ReactElement } from 'react';
import Button from '@material/react-button';
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
  type?: string
  disabled?: boolean
  style?: any;
}

export default function CBKButton(props: CBKButtonProps) {
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
      <Button
        disabled={props.disabled}
        unelevated={props.unelevated}
        raised={props.raised}
        outlined={props.outlined}
        className={props.className}
        onClick={props.onClick}
        style={props.style}
        type={props.type || 'button'}
      >
        { props.children }
      </Button>
    )
  }
};