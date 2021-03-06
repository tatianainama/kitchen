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
  [Meal.Lunch]?: RecipePlan | string,
  [Meal.Dinner]?: RecipePlan | string,
  [Meal.Dessert]?: RecipePlan | string
}

export type WeekPlan = {
  [day in Weekday]: DayPlan;
};

export type SimpleWeekPlan = {
  [day in Weekday]: {
    date: Moment,
    meals: [{
      type: Meal,
      recipe: RecipePlan
    }]
  };
}

export interface WeeklyPlanner extends WeekPlan {
  week: number;
}

export interface Plan {
  date: Date,
  meal: Meal
  recipe?: ObjectID,
  custom?: string,
}

export default interface PlanDB extends Plan {
  _id: ObjectID,
}

export interface RecipePlan {
  _id: string,
  name: string
}

export interface CompletePlanDB extends Omit<PlanDB, 'recipe'> {
  recipe: RecipePlan,
  custom?: string
}
