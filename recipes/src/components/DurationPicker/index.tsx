import React, { useState, useEffect } from "react";
import moment from 'moment';

import Input from 'components/Input';

import './styles.scss';

type DurationPickerProps = {
  initialValue?: string,
  label?: string,
  onChange: (ISODuration: string) => void
}

const toISODuration = (hours: number, minutes: number) => moment.duration({ minutes, hours }).toISOString();

export const DurationPicker: React.SFC<DurationPickerProps> = ({ initialValue = '', onChange, label }) => {
  
  const initial = moment.duration(initialValue);
  const [minutes, setMinutes] = useState(initial.minutes());
  const [hours, setHours] = useState(initial.hours());
  
  useEffect(() => {
    setMinutes(initial.minutes())
    setHours(initial.hours())
  }, [initialValue])

  return (
    <div className='cbk-duration'>
      <label>{label}</label>
      <div className='cbk-duration__input'>
        <Input
          type='number'
          label='H'
          min={0}
          value={hours}
          onChange={({ currentTarget }) => {
            setHours(parseInt(currentTarget.value));
            onChange(toISODuration(parseInt(currentTarget.value), minutes))
          }}
        />
        <Input
          type='number'
          label='M'
          min={0}
          max={59}
          value={minutes} 
          onChange={(e) => {
            setMinutes(parseInt(e.currentTarget.value));
            onChange(toISODuration(hours, parseInt(e.currentTarget.value)))
          }}
        />
      </div>
    </div>
  )
}

export default DurationPicker;