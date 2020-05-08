import React, { useState } from 'react';
import Dialog from 'components/Dialog';
import { GetMeasure, Convert, Measure } from 'services/measurements';
import Button from 'components/Button';

import './styles.scss';

type Data = {
  unit: string,
  quantity: number
}

interface DialogProps {
  measure: Data,
  onConvert: (result: Data) => void,
  measureName?: string,
}

const CBKDialog = ({measure, onConvert, measureName}: DialogProps) => {
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
      ></Button>
      <Dialog
        actions={{
          cancel: {
            label: 'cancel',
            onSelect: () => { setOpen(false) }
          },
          convert: {
            label: 'convert',
            onSelect: () => {
              setOpen(false);
              onConvert(result);
            },
            isDefault: true
          },
        }}
        isOpen={isOpen}
      >
        <div>
          {/* <p>Converting <b>{measure.quantity + ' ' + measure.unit}</b> to:</p> */}
          <div className='cbk-convert__dialog__content'>
            <p>converting {measureName} </p>
            <div className='cbk-convert__dialog__content__converter'>
                <div>{measure.quantity}</div>
                <div className='cbk-convert__dialog__content__converter--equal'> = </div>
                <div>{result.quantity}</div>
                <div>{measure.unit}</div>
                <select value={result.unit} onChange={(e) => {
                  convert(measure.quantity, measure.unit, e.target.value);
                }}>
                  {
                    values.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))
                  }
                </select>
            </div>


            {/* <select value={result.unit} onChange={(e) => {
              convert(measure.quantity, measure.unit, e.target.value);
            }}>
              {
                values.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))
              }
            </select>
              {`${result.quantity} ${result.unit}`}  */}
          </div>

        </div>
      </Dialog>
    </>
  )
}

export default CBKDialog;