import { WriteOpResult } from 'mongodb';
import { IMongoService, IDBDocument } from '../mongo';
import { ChainPController } from '../promise-all-middleware';
import PlanDB, { WeeklyPlanner, CompletePlanDB, Weekday, Plan, CompactWeeklyPlanner } from './model';
import moment, { Moment } from 'moment';
import { ObjectId } from 'bson';
import { Request, NextFunction, Response } from 'express';

type Controller<U, T> = (db: IMongoService) => ChainPController<U, T>;

export const getWeekDay = (day: Moment): Weekday => day.format('dddd').toLowerCase() as Weekday;

const mkWeekQuery = (week: string) => ({
  week: parseInt(week) || moment().isoWeek()
});

const validatePlan = (mbPlan: any) => mbPlan.date && mbPlan.week && mbPlan.recipe && mbPlan.meal;

const validPlan = (mbPlan: any): Promise<Plan> => {
  if (mbPlan.date && mbPlan.week && mbPlan.recipe && mbPlan.meal) {
    return Promise.resolve({
      ...mbPlan,
      date: new Date(mbPlan.date),
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
    const date = moment(plan.date);
    return {
      ...planner,
      [getWeekDay(date)]: {
        ...planner[getWeekDay(date)],
        date: date,
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
    const date = moment(plan.date);
    return {
      ...planner,
      [getWeekDay(date)]: {
        ...planner[getWeekDay(date)],
        date: date,
        [plan.meal]: plan.recipe
      }
    };
  }, { week } as CompactWeeklyPlanner))
}

const savePlan: Controller<void, PlanDB> = db => req => prevResult => {
  const plan = req.body;
  return validPlan(plan).then(db.insertOne)
}

type PlannerRequest = {
  planner: Plan[],
  from: Date,
  to: Date
};

const toPlan = (plan: any): Plan => ({
  ...plan,
  date: new Date(plan.date),
  recipe: new ObjectId(plan.recipe),
})

const validatePlanner: Controller<any, PlannerRequest> = () => ({ body }) => async () => {
  if (body.planner && Array.isArray(body.planner) && new Date(body.from) && new Date(body.to)) {
    const planner: Plan[] = body.planner.map(toPlan);
    return Promise.resolve({
      planner,
      from: new Date(body.from),
      to: new Date(body.to)
    })
  } else {
    return Promise.reject('Invalid request: Body must have planner, from and to properties')
  }
}

const saveWeekPlanner: Controller<PlannerRequest, IDBDocument<Plan[]>> = db => req => async ({ planner, from , to }) => {
  try {
    return db.deleteMany({
      'date': {'$gte': new Date(from), '$lte': new Date(to)}
    }).then(result => {
      return planner.length ? db.insertMany<Plan>(planner) : []
    })
  } catch(error) {
    console.error(error)
    return error;
  }
}

export {
  getWeekPlanner,
  completePlanner,
  compactPlanner,
  savePlan,
  saveWeekPlanner,
  validatePlanner
}