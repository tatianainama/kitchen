import { SubRecipe } from 'types/recipes';
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
  Dessert
}

export type RecipePlan = {
  _id: string,
  name: string,
  ingredients: SubRecipe[]
}

export type DayPlan = {
  date: Moment,
  [Meal.Lunch]?: RecipePlan,
  [Meal.Dinner]?: RecipePlan,
  [Meal.Dessert]?: RecipePlan
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

export const Meals = [Meal.Lunch, Meal.Dinner, Meal.Dessert]

export enum WeekShift {
  Prev,
  Next
}