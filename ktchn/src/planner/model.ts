import { ObjectID } from 'mongodb';
import { RecipeDB } from '../recipes/model';
import { Moment, weekdays } from 'moment';

export enum Meal {
  Lunch = 0,
  Dinner,
  Dessert
}

export type Weekday =
  'monday' |
  'tuesday' |
  'wednesday' |
  'thursday' |
  'friday' |
  'saturday' |
  'sunday';

export type DayPlan = {
  date: Moment,
  [Meal.Lunch]?: RecipePlan,
  [Meal.Dinner]?: RecipePlan,
  [Meal.Dessert]?: RecipePlan
}

export type WeekPlan = {
  [day in Weekday]: DayPlan;
};

export interface WeeklyPlanner extends WeekPlan {
  week: number;
}

export interface Plan {
  date: Date,
  recipe: ObjectID,
  meal: Meal
}

export default interface PlanDB extends Plan {
  _id: ObjectID,
}

export interface RecipePlan {
  _id: string,
  name: string
}

export interface CompletePlanDB extends Omit<PlanDB, 'recipe'> {
  recipe: RecipePlan
}
