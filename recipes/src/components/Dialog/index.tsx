import React from 'react';
import {
  Dialog,
  DialogContent
} from '@rmwc/dialog';
import Button from 'components/Button';

import '@rmwc/dialog/styles';
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
      open={isOpen}
      onClose={
        (evt) => {
          if (evt.detail.action) {
            return actions[evt.detail.action] && actions[evt.detail.action].onSelect()
          }
        }
      }
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
              outlined={actions[action].isDefault}
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