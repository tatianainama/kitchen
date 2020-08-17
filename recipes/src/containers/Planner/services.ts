import { shortDate, mkWeekDay, mkWeek } from 'services/time';
import axios from 'axios';
import { DBPlanner, DBDayPlan, WeekPlan, Weekday, DayPlan, Meal } from 'types/planner';
import moment, { Moment } from 'moment';

//@ts-ignore
const PLANNER: string = process.env.REACT_APP_API_PLANNER;

const toDBPlan = (weekplan: WeekPlan) => {
  const planner = Object.keys(weekplan).map((weekday) => weekplan[weekday as Weekday]);
  const mkPlan = (day: DayPlan, meal: Meal): Array<DBDayPlan> => {
    const dish = day[meal];
    const date = moment(day.date).format();

    if (dish === undefined) {
      return []
    } else {
      if (typeof dish === 'string') {
        return [{
          meal,
          date,
          custom: dish
        }]
      } else {
        return [{
          recipe: dish._id,
          meal: meal,
          date: date
        }]
      }
    }
  } 
  return planner.reduce((acc, day)=> {
    return [
      ...acc,
      ...mkPlan(day, Meal.Lunch),
      ...mkPlan(day, Meal.Dinner),
      ...mkPlan(day, Meal.Dessert)
    ]
  }, [] as Array<DBDayPlan>)
}

export const mkPlanner = (from: Moment = moment()): WeekPlan => mkWeek().reduce((planner, weekday, index)=> {
  return {
    ...planner,
    [weekday]: { date: mkWeekDay(index+1, from.isoWeek()) }
  } 
}, {} as WeekPlan);

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
