import React from 'react';
import Dialog, {
  DialogContent
} from '@material/react-dialog';
import Button from 'components/Button';

import '@material/react-dialog/dist/dialog.min.css';
import './styles.scss'

interface DialogProps {
  isOpen: boolean
  actions: {
    [name: string]: {
      label: string,
      onSelect: () => void,
      isDefault?: boolean
    },
  },
  children?: React.ReactElement
}
const CBK_Dialog = ({ isOpen, actions, children }: DialogProps) => {
  return (
    <Dialog
      scrimClickAction={''}
      escapeKeyAction={''}
      open={isOpen}
      onClose={(action: string) => actions[action] && actions[action].onSelect() }
      className='cbk-dialog'
    >
      <DialogContent className='cbk-dialog__content'>
        {children}
      </DialogContent>
      <div className='cbk-dialog__footer'>
        {
          Object.keys(actions).map((action, index) => (
            <Button
              key={index}
              outlined={!actions[action].isDefault}
              unelevated={actions[action].isDefault}
              onClick={actions[action].onSelect}
            >
              {actions[action].label}
            </Button>
          ))
        }
      </div>
    </Dialog>
  )
};

export default CBK_Dialog;