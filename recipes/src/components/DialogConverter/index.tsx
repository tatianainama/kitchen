import React, { useState } from 'react';
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogButton
} from '@material/react-dialog';
import { GetMeasure, Convert, Measure } from 'services/measurements';
import Button from 'components/Button';

import '@material/react-dialog/dist/dialog.min.css';
import './styles.scss';

type Data = {
  unit: string,
  quantity: number
}

interface DialogProps {
  measure: Data,
  onConvert: (result: Data) => void
}

const CBKDialog = ({measure, onConvert}: DialogProps) => {
  const { name, values } = GetMeasure(measure.unit);
  const [ isOpen, setOpen ] = useState(false);
  const [ result, setResult ] = useState({
    unit: measure.unit,
    quantity: measure.quantity
  })
  
  const convert = (qty: number, from: string, to: string) => {
    setResult({unit: to, quantity: Convert(qty, from, to, name as Measure)})
  }
  return (
    <>
      <Button
        icon='compare_arrows'
        type='button'
        onClick={() => setOpen(true)}
        disabled={measure.unit === ''}
        className='cbk-convert__button'
        title='convert unit'
      ></Button>
      <Dialog
        onClose={(action) => {
          if (action === 'confirm') {
            onConvert(result)
          }
          setOpen(false)
        }}
        open={isOpen}
      >
        <DialogContent className='cbk-convert__dialog'>
          <p>Converting <b>{measure.quantity + ' ' + measure.unit}</b> to:</p>
          <div className='cbk-convert__dialog__content'>
            <select value={result.unit} onChange={(e) => {
              convert(measure.quantity, measure.unit, e.target.value);
            }}>
              {
                values.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))
              }
            </select>
              {`${result.quantity} ${result.unit}`} 
          </div>

        </DialogContent>
        <DialogFooter>
          <DialogButton action='dismiss' type='button'>cancel</DialogButton>
          <DialogButton action='confirm' type='button'>ok</DialogButton>
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default CBKDialog;