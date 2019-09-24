
import { IMongoService } from '../mongo';
import { ChainPController } from '../promise-all-middleware';
import PlanDB, { WeeklyPlanner, CompletePlanDB, Weekday, Plan, CompactWeeklyPlanner } from './model';
import moment, { Moment } from 'moment';
import { ObjectId } from 'bson';

type Controller<U, T> = (db: IMongoService) => ChainPController<U, T>;

export const getWeekDay = (day: Moment): Weekday => day.format('dddd').toLowerCase() as Weekday;

const mkWeekQuery = (week: string) => ({
  week: parseInt(week) || moment().isoWeek()
});

const validatePlan = (mbPlan: any) => mbPlan.date && mbPlan.week && mbPlan.recipe && mbPlan.meal;

const validPlan = (mbPlan: any) => {
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

const saveManyPlans: Controller<void, PlanDB[]> = db => req => prev => {
  const mbPlanner = req.body;
  if (mbPlanner.filter) {
    const valid = mbPlanner.filter(validatePlan);
    if (valid.length) {
      return db.insertMany(valid)
    } else {
      return Promise.reject('Data did not have required fields: date, week, meal, ')
    }
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