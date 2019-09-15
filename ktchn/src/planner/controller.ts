
import { Request, Response, NextFunction } from 'express';
import { IMongoService } from '../mongo';
import { ChainPController } from '../promise-all-middleware';
import PlanDB, { WeeklyPlanner, CompletePlanDB, Weekday, Plan, CompactWeeklyPlanner } from './model';
import moment, { Moment } from 'moment';
import { ObjectId } from 'bson';
import { RecipeDB } from '../recipes/model';

type Controller<U, T> = (db: IMongoService) => ChainPController<U, T>;

export const getWeekDay = (day: Moment): Weekday => day.format('dddd').toLowerCase() as Weekday;

const mkWeekQuery = (week: string) => ({
  week: parseInt(week) || moment().isoWeek()
});

const validatePlan = (mbPlan: any) => mbPlan.day && mbPlan.week && mbPlan.recipe && mbPlan.meal;

const validPlan = (mbPlan: any) => {
  if (mbPlan.day && mbPlan.week && mbPlan.recipe && mbPlan.meal) {
    return Promise.resolve({
      ...mbPlan,
      day: new Date(mbPlan.day),
      recipe: new ObjectId(mbPlan.recipe)
    } as Plan)
  } else {
    return Promise.reject('Required fields: day, week, recipe and meal');
  }
}

const getWeekPlanner: Controller<void, PlanDB[]> =
  db => req => () => db.find<PlanDB>(mkWeekQuery(req.params.week));

const completePlanner: Controller<PlanDB[], WeeklyPlanner> = db => req => prevResult => {
  const week = mkWeekQuery(req.params.week).week;
  return db.aggregate<CompletePlanDB>([
    {
      '$match': {
        'week': week
      }
    },
    {
      '$lookup': {
        'from': 'recipes', 
        'localField': 'recipe', 
        'foreignField': '_id', 
        'as': 'recipe'
      }
    }, {
      '$unwind': {
        'path': '$recipe'
      }
    }
  ]).then(plans => plans.reduce((planner, plan) => {
    const day = moment(plan.day);
    return {
      ...planner,
      [getWeekDay(day)]: {
        ...planner[getWeekDay(day)],
        day,
        [plan.meal]: plan.recipe
      }
    };
  }, { week } as WeeklyPlanner))
}

const compactPlanner: Controller<null, CompactWeeklyPlanner> = db => req => prevResult => {
  const week = mkWeekQuery(req.params.week).week;
  return db.aggregate<CompletePlanDB>([
    {
      '$match': {
        'week': week
      }
    },
    {
      '$lookup': {
        'from': 'recipes', 
        'localField': 'recipe', 
        'foreignField': '_id', 
        'as': 'recipe'
      }
    }, {
      '$unwind': {
        'path': '$recipe'
      }, 
    }, {
      '$project': {
        'recipe': {
          'author': 0, 
          'details': 0, 
          'ingredients': 0, 
          'instructions': 0
        }
      }
    }
  ]).then(plans => plans.reduce((planner, plan) => {
    const day = moment(plan.day);
    return {
      ...planner,
      [getWeekDay(day)]: {
        ...planner[getWeekDay(day)],
        day,
        [plan.meal]: plan.recipe
      }
    };
  }, { week } as CompactWeeklyPlanner))
}

const savePlan: Controller<void, PlanDB> = db => req => prevResult => {
  const plan = req.body;
  return validPlan(plan).then(db.insertOne)
}

const saveManyPlans: Controller<void, PlanDB[]> = db => req => prev => {
  const mbPlanner = req.body;
  if (mbPlanner.filter) {
    return db.insertMany(mbPlanner.filter(validatePlan))
  } else {
    return Promise.reject('Invalid type: body content must be a Plan Array')
  }

}
export {
  getWeekPlanner,
  completePlanner,
  compactPlanner,
  savePlan,
  saveManyPlans,
}