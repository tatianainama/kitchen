import moment, { Moment } from 'moment';
import { Weekday } from 'types/planner';

export const mkWeek = () => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as Weekday[];

export const mkWeekDay = (day: string | number, week?: number): Moment => {
  const date = week ? moment().week(week) : moment();
  return date.isoWeekday(day);
};

export const getWeekNumber = (date?: string|Date|Moment): number => moment(date).isoWeek();

export const getWeekDay = (day: Moment): Weekday => day.format('dddd').toLowerCase() as Weekday;

export const mkWeekData = (weekNumber: number): [Weekday, string][] => mkWeek().map(day => (
  [ day, moment().week(weekNumber).isoWeekday(day).format() ]
))

export const shortDate = (date: Moment): string => date.format('YYYY-MM-DD')

export default {
  mkWeekDay,
  getWeekNumber,
  getWeekDay,
  mkWeekData,
  shortDate,
}
