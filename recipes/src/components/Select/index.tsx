import React from 'react';

import './styles.scss';

type CBKSelectProps = {
  label?: string,
  value?: string,
  options: {
    label: string,
    value: string,
    disabled?: boolean,
  }[],
  disabled?: boolean,
  onChange: (x: any) => void
}

export const CBKSelect: React.FunctionComponent<CBKSelectProps> = (props) => (
  <select defaultValue={props.value || ''} className='cbk-select-2' onChange={props.onChange} placeholder={props.label}>
    <option value='' disabled> {props.label} </option>
    { 
      props.options.map((option, key) => (
        <option key={key} disabled={option.disabled} value={option.value}> {option.label} </option>
      ))
    }
  </select>
)

export default CBKSelect