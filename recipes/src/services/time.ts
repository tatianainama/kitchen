import moment, { Moment } from 'moment';
import { Weekday } from 'types/planner';

export const mkWeek = () => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as Weekday[];

export const mkWeekDay = (day: string | number): Moment => moment().isoWeekday(day);

export const getWeekNumber = (): number => moment().isoWeek();

export const getWeekDay = (day: Moment): string => day.format('dddd').toLowerCase();

export const mkWeekData = (weekNumber: number): [Weekday, string][] => mkWeek().map(day => (
  [ day, moment().week(weekNumber).isoWeekday(day).format() ]
))

export default {
  mkWeekDay,
  getWeekNumber,
  getWeekDay,
  mkWeekData
}
