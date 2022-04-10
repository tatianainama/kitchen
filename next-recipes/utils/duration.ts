import * as dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const mkDuration = dayjs.duration;

export const durationInMinutes = (isoDuration: string): number => {
  return dayjs.duration(isoDuration).asMinutes();
};

export default durationInMinutes;
