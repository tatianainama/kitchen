import { IMongoService, IDBDocument } from '../mongo';
import { ChainPController } from '../promise-all-middleware';
import PlanDB, { WeeklyPlanner, CompletePlanDB, Weekday, Plan, CompactWeeklyPlanner } from './model';
import moment, { Moment } from 'moment';
import { ObjectId } from 'bson';

type Controller<U, T> = (db: IMongoService) => ChainPController<U, T>;

export const getWeekDay = (day: Moment): Weekday => day.format('dddd').toLowerCase() as Weekday;

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

const validateRange: Controller<void, {from: Date, to: Date}> = () => req => () => {
  const from = moment(req.params.from),
        to = moment(req.params.to);
  return from.isValid() && to.isValid() && to.diff(from, 'days') === 6 ?
    Promise.resolve({ from: from.toDate(), to: to.toDate()}) :
    Promise.reject('Invalid date range');
}

const getPlannerByRange: Controller<{from: Date, to: Date}, WeeklyPlanner> = db => () => ({ from, to }) => {
  return db.aggregate<CompletePlanDB>([
    {
      '$match': {
        'date': {'$gte': from, '$lte': to}
      }
    }, {
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
  }, { week: moment(from).isoWeek() } as WeeklyPlanner))
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
  savePlan,
  saveWeekPlanner,
  validatePlanner,
  validateRange,
  getPlannerByRange
}