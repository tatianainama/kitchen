import React, { ReactElement } from 'react';
import Button from '@material/react-button';
import IconButton from '@material/react-icon-button';
import MaterialIcon from '@material/react-material-icon';

import '@material/react-button/dist/button.css';
import '@material/react-icon-button/dist/icon-button.css'
import '@material/react-material-icon/dist/material-icon.css';

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
      <IconButton onClick={props.onClick} {...props}>
        <MaterialIcon icon={props.icon}/>
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