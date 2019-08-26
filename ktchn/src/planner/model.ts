import { ObjectID } from 'mongodb';
import { RecipeDB } from '../recipes/model';
import { Moment, weekdays } from 'moment';

export type Meal = 'lunch' | 'dinner';

export type Weekday =
  'monday' |
  'tuesday' |
  'wednsday' |
  'thursday' |
  'friday' |
  'saturday' |
  'sunday';

export type WeekPlan = {
  [day in Weekday]: DayPlan;
};

export default interface PlanDB {
  _id: ObjectID,
  day: Date,
  week: number,
  recipe: ObjectID,
  meal: Meal
}

export interface CompletePlanDB extends Omit<PlanDB, 'recipe'> {
  recipe: RecipeDB
}

export interface DayPlan {
  date: Moment,
  lunch?: RecipeDB,
  dinner?: RecipeDB
}

export interface WeeklyPlanner extends WeekPlan {
  week: number
}

