import { Moment } from "moment";
import { DBRecipe } from "./recipes";

export type Weekday =
  'monday' |
  'tuesday' |
  'wednsday' |
  'thursday' |
  'friday' |
  'saturday' |
  'sunday';

export type DayPlan = {
  date: Moment,
  lunch?: DBRecipe,
  dinner?: DBRecipe,
};

export type WeekPlan = {
  [day in Weekday]: DayPlan;
};

export type Meal = 'lunch' | 'dinner';

export default interface Planner extends WeekPlan {
  week: number,
  from: Moment,
  to: Moment
};

export interface PlannerState {
  isFetching: boolean,
  error?: string,
  data: Planner,
  backlog: DBRecipe[]
}