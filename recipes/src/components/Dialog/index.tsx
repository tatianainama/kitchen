import React from 'react';
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogButton
} from '@material/react-dialog';

import '@material/react-dialog/dist/dialog.min.css';

interface DialogProps {
  isOpen: boolean
  actions: {
    [name: string]: {
      label: string,
      onSelect: () => void,
      isDefault?: boolean
    },
  }
  children?: React.ReactElement
}
const CBK_Dialog = (props: DialogProps) => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={(action: string) => props.actions[action].onSelect()}
    >
      <DialogContent>
        {props.children}
      </DialogContent>
      <DialogFooter>
        {
          Object.keys(props.actions).map((action, index) => (
            <DialogButton
              key={index}
              action={action}
              isDefault={props.actions[action].isDefault}
            >
              {props.actions[action].label}
            </DialogButton>
          ))
        }
      </DialogFooter>
    </Dialog>
  )
};

export default CBK_Dialog;