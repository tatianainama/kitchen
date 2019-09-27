import { shortDate } from 'services/time';
import axios, { AxiosPromise } from 'axios';
import { DBPlanner, DBDayPlan, WeekPlan, Weekday, DayPlan, Meal } from 'types/planner';
import moment, { Moment } from 'moment';

//@ts-ignore
const PLANNER: string = process.env.REACT_APP_API_PLANNER;

const toDBPlan = (weekplan: WeekPlan) => {
  const planner = Object.keys(weekplan).map((weekday) => weekplan[weekday as Weekday]);
  const mkPlan = (day: DayPlan, meal: Meal): Array<DBDayPlan> => {
    const dish = day[meal];
    const date = moment(day.date);
    return dish ? [{
      week: date.week(),
      recipe: dish._id,
      meal: meal,
      date: date.format()
    }] : []
  } 
  return planner.reduce((acc, day)=> {
    return [
      ...acc,
      ...mkPlan(day, Meal.Lunch),
      ...mkPlan(day, Meal.Dinner)
    ]
  }, [] as Array<DBDayPlan>)
}

export const getPlanner = (from: Moment, to: Moment): Promise<DBPlanner> => 
  axios.get(`${PLANNER}/week/${shortDate(from)}/${shortDate(to)}`).then(response => response.data);

export const savePlanner = (weekPlan: WeekPlan, from: Moment, to: Moment): Promise<Array<DBDayPlan>> => {
  return axios.post(`${PLANNER}/week`, {
    planner: toDBPlan(weekPlan),
    from: shortDate(from),
    to: shortDate(to),
  })
    .then(response => response.data)
}

export default {
  getPlanner,
  savePlanner,
}
