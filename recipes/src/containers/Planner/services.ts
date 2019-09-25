import axios, { AxiosPromise } from 'axios';
import { DBPlanner, DBDayPlan, WeekPlan, Weekday, Meal, DayPlan } from 'types/planner';
import moment from 'moment';

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
      ...mkPlan(day, 'lunch'),
      ...mkPlan(day, 'dinner')
    ]
  }, [] as Array<DBDayPlan>)
}
export const getPlanner = (week: number): Promise<DBPlanner> =>
  axios.get(`${PLANNER}/week/${week}/compact`)
  .then(response => response.data)

export const savePlanner = (weekPlan: WeekPlan): Promise<Array<DBDayPlan>> => {
  return axios.post(`${PLANNER}/`, toDBPlan(weekPlan))
    .then(response => response.data)
}

export default {
  getPlanner,
  savePlanner
}
