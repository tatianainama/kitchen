import { Moment } from "moment";

export type Weekday =
  'monday' |
  'tuesday' |
  'wednesday' |
  'thursday' |
  'friday' |
  'saturday' |
  'sunday';

export type RecipePlan = {
  _id: string,
  name: string,
}

export type DayPlan = {
  date: Moment,
  lunch?: RecipePlan,
  dinner?: RecipePlan,
};

export type WeekPlan = {
  [day in Weekday]: DayPlan;
};

export type Meal = 'lunch' | 'dinner';

export interface PlannerState {
  isFetching: boolean,
  error?: string,
  week: number,
  from: Moment,
  to: Moment,
  planner: WeekPlan,
  backlog: RecipePlan[]
}

export interface DBPlanner extends WeekPlan {
  week: number,
}