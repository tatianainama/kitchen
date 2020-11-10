import { IMongoService, IDBDocument } from '../mongo';
import { ChainPController } from '../promise-all-middleware';
import PlanDB, { CompletePlanDB, Weekday, Plan, WeeklyPlanner, SimpleWeekPlan } from './model';
import moment, { Moment } from 'moment';
import { ObjectId } from 'bson';

type Controller<U, T> = (db: IMongoService) => ChainPController<U, T>;

export const getWeekDay = (day: Moment): Weekday => day.format('dddd').toLowerCase() as Weekday;

const validPlan = (mbPlan: any): Promise<Plan> => {
  if (mbPlan.date && mbPlan.week && (mbPlan.recipe || mbPlan.custom) && mbPlan.meal) {
    return Promise.resolve({
      ...mbPlan,
      date: new Date(mbPlan.date),
      ...mbPlan.recipe && { recipe: new ObjectId(mbPlan.recipe) },
      ...mbPlan.custom && { custom: mbPlan.custom }
    } as Plan)
  } else {
    return Promise.reject('Required fields: day, week, meal and recipe/custom');
  }
}

const validateRange: Controller<void, {from: Date, to: Date}> = () => req => () => {
  const from = moment(req.params.from),
        to = moment(req.params.to);
  return from.isValid() && to.isValid() && to.diff(from, 'days') === 6 ?
    Promise.resolve({ from: from.toDate(), to: to.toDate()}) :
    Promise.reject('Invalid date range');
}

const PlannerQueryByRange = (db: IMongoService, from: Date, to: Date) => {
  return db.aggregate<CompletePlanDB>([
    {
      '$match': {
        'date': {'$gte': moment(from).startOf('day').toDate(), '$lte': moment(to).endOf('day').toDate()}
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
        'path': '$recipe',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'recipe': {
          'author': 0, 
          'details': 0, 
          'instructions': 0
        }
      }
    }
  ]);
}

const getPlannerByRange: Controller<{from: Date, to: Date}, WeeklyPlanner> = db => () => ({ from, to }) => {
  return PlannerQueryByRange(db, from, to).then(plans => plans.reduce((planner, plan) => {
    const date = moment(plan.date);
    return {
      ...planner,
      [getWeekDay(date)]: {
        ...planner[getWeekDay(date)],
        date: date,
        [plan.meal]: plan.custom || plan.recipe
      }
    };
  }, { week: moment(from).isoWeek() } as WeeklyPlanner))
}

const getSimplifyPlannerByRange: Controller<{from: Date, to: Date}, SimpleWeekPlan> = db => () => ({ from, to }) => {
  return PlannerQueryByRange(db, from, to).then(data => {
    return data.reduce((planner, plan) => {
      const weekday = getWeekDay(moment(plan.date));
      const meals = planner[weekday]?.meals || [];
      return {
        ...planner,
        [weekday]: {
          meals: [
            ...meals,
            {
              type: plan.meal,
              recipe: plan.custom || plan.recipe
            }
          ]
        }
      }
    }, {} as SimpleWeekPlan);
  });
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
  ...plan.recipe && { recipe: new ObjectId(plan.recipe) },
  ...plan.custom && { custom: plan.custom }
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
  getPlannerByRange,
  getSimplifyPlannerByRange
}