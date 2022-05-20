import { FC, useState, useEffect } from 'react';
import { mkDuration } from '@/utils/duration';

type DurationInputProps = {
  name: string;
  label?: string;
  className?: string;
  onChange: (value: string) => void;
  value: string;
};

type NewDuration = (
  hours?: string | number,
  minutes?: string | number
) => { hours: number; minutes: number };

const newDuration: NewDuration = (hours = 0, minutes = 0) => {
  let newMin = typeof minutes === 'string' ? parseInt(minutes) : minutes;
  let newHour = typeof hours === 'string' ? parseInt(hours) : hours;

  if (newMin > 50) {
    newHour = newHour + Math.floor(newMin / 60);
    newMin = newMin % 60;
  }

  return {
    hours: newHour,
    minutes: newMin
  };
};

const DurationInput: FC<DurationInputProps> = ({
  name,
  label,
  className,
  onChange,
  value = ''
}) => {
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    if (value) {
      const newValue = mkDuration(value);
      const newMin = newValue.minutes();
      const newHs = newValue.hours();
      if (newMin !== duration.minutes || newHs !== duration.hours) {
        setDuration(newDuration(newHs, newMin));
      }
    }
  }, [value]);

  return (
    <fieldset name={name} className={className}>
      {label && <legend className="font-display font-bold">{label}</legend>}
      <div className="flex-1 flex relative">
        <input
          id={`${name}-h`}
          type="number"
          value={duration.hours || '0'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = newDuration(e.target.value, duration.minutes);
            setDuration(newValue);
            onChange(
              mkDuration({
                hours: newValue.hours,
                minutes: newValue.minutes
              }).toISOString()
            );
          }}
          min={0}
          max={100}
          step={1}
          className="input flex-1 peer"
          placeholder="h"
        />
        <label className="absolute right-6 text-xs top-1/2 -translate-y-1/2 text-grey-400 font-semibold">
          H
        </label>
      </div>
      <div className="flex-1 flex relative">
        <input
          id={`${name}-m`}
          type="number"
          value={duration.minutes || '0'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = newDuration(duration.hours, e.target.value);
            setDuration(newValue);
            onChange(
              mkDuration({
                hours: newValue.hours,
                minutes: newValue.minutes
              }).toISOString()
            );
          }}
          min={0}
          max={60}
          step={5}
          className="input flex-1 peer"
          placeholder="m"
        />
        <label className="absolute right-6 text-xs top-1/2 -translate-y-1/2 text-grey-400 font-semibold">
          M
        </label>
      </div>
    </fieldset>
  );
};

export default DurationInput;
