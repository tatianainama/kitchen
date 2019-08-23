import moment, { Moment } from 'moment';

export const mkWeekDay = (day: string | number): Moment => moment().isoWeekday(day);

export const getWeekNumber = (): number => moment().isoWeek();

export const getWeekDay = (day: Moment): string => day.format('dddd').toLowerCase();

export default {
  mkWeekDay,
  getWeekNumber,
  getWeekDay
}
