import { FC, useState, useEffect } from 'react';
import { mkDuration } from '@/utils/duration';

const DurationInput: FC<{
  name: string;
  label?: string;
  className?: string;
  onChange: (value: string) => void;
  value: string;
}> = ({ name, label, className, onChange, value = '' }) => {
  const initial = mkDuration(value);
  const [minutes, setMinutes] = useState(initial.minutes());
  const [hours, setHours] = useState(initial.hours());

  useEffect(() => {
    if (value) {
      const newValue = mkDuration(value);
      if (newValue.minutes() !== minutes) {
        setMinutes(newValue.minutes());
      }
      if (newValue.hours() !== hours) {
        setHours(newValue.hours());
      }
    }
  }, [value]);

  return (
    <fieldset name={name} className={className}>
      {label && <legend className="font-display font-bold">{label}</legend>}
      <input
        id={`${name}-h`}
        type="number"
        value={hours || '0'}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const h = parseInt(e.target.value);
          setHours(h);
          onChange(mkDuration({ hours: h, minutes }).toISOString());
        }}
        min={0}
        max={100}
        className="input flex-1"
        placeholder="h"
      />
      <input
        id={`${name}-m`}
        type="number"
        value={minutes || '0'}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const m = parseInt(e.target.value);
          setMinutes(m);
          onChange(mkDuration({ hours, minutes: m }).toISOString());
        }}
        min={0}
        max={60}
        className="input flex-1"
        placeholder="m"
      />
    </fieldset>
  );
};

export default DurationInput;
