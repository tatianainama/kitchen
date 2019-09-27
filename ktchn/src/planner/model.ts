import { ObjectID } from 'mongodb';
import { RecipeDB } from '../recipes/model';
import { Moment, weekdays } from 'moment';

export enum Meal {
  Lunch = 1,
  Dinner
}

export type Weekday =
  'monday' |
  'tuesday' |
  'wednsday' |
  'thursday' |
  'friday' |
  'saturday' |
  'sunday';

export type WeekPlan<T> = {
  [day in Weekday]: T;
};

export interface Plan {
  date: Date,
  recipe: ObjectID,
  meal: Meal
}

export default interface PlanDB extends Plan{
  _id: ObjectID,
}

export interface RecipePlan {
  _id: string,
  name: string
}

export interface CompletePlanDB extends Omit<PlanDB, 'recipe'> {
  recipe: RecipePlan
}

export interface DayPlan {
  date: Moment,
  lunch?: RecipeDB,
  dinner?: RecipeDB
}

export interface CompactDayPlan {
  date: Date,
  lunch?: { _id: ObjectID, name: string },
  dinner?: { _id: ObjectID, name: string },
}

export interface WeeklyPlanner extends WeekPlan<DayPlan> {
  week: number
}

export interface CompactWeeklyPlanner extends WeekPlan<CompactDayPlan> {
  week: number
}

