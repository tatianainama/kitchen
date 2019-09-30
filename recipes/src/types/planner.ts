import { Moment } from "moment";

export type Weekday =
  'monday' |
  'tuesday' |
  'wednesday' |
  'thursday' |
  'friday' |
  'saturday' |
  'sunday';

export enum Meal {
  Lunch = 0,
  Dinner,
}

export type RecipePlan = {
  _id: string,
  name: string,
}

export type DayPlan = {
  date: Moment,
  [Meal.Lunch]?: RecipePlan,
  [Meal.Dinner]?: RecipePlan,
};

export type WeekPlan = {
  [day in Weekday]: DayPlan;
};

export enum PlannerMode {
  View = 'VIEW',
  Edit = 'EDIT'
}

export interface PlannerState {
  mode: PlannerMode,
  isFetching: boolean,
  saving: boolean,
  error?: string,
  week: number,
  from: Moment,
  to: Moment,
  planner: WeekPlan,
  backlog: RecipePlan[],
  edit: boolean,
}

export interface DBDayPlan {
  date: string,
  recipe: string,
  meal: Meal
}

export interface DBPlanner extends WeekPlan {
  week: number,
}