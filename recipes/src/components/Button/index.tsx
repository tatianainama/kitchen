import React from 'react';
import Button from '@material/react-button';
import '@material/react-button/dist/button.css';

type CBKButtonProps = {
  children: string,
  className?: string,
  unelevated?: boolean,
  raised?: boolean,
  outlined?: boolean,
}

export default function CBKButton(props: any) {
  return (
    <Button >
      Click Me!
    </Button>
  )
}