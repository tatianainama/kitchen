import React, { ReactElement } from 'react';
import Button from '@material/react-button';
import Icon from 'components/Icon';
import IconButton from '@material/react-icon-button';

import '@material/react-button/dist/button.css';
import '@material/react-icon-button/dist/icon-button.css'

type CBKButtonProps = {
  children: string|ReactElement,
  className?: string,
  unelevated?: boolean,
  raised?: boolean,
  outlined?: boolean,
  icon?: string,
  onClick?: () => void,
}

export default function CBKButton(props: any) {
  if (props.icon) {
    return (
      <IconButton onClick={props.onClick} {...props} >
        <Icon material icon={props.icon}/>
      </IconButton>
    );
  } else {
    return (
      <Button {...props}>
        { props.children }
      </Button>
    )
  }
};