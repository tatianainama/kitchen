import { Router } from 'express';
import mongoService, { IMongoService } from '../mongo';
import MongoClient from 'mongodb';
import { chainP } from '../promise-all-middleware';
import { savePlan, saveWeekPlanner, validatePlanner, validateRange, getPlannerByRange } from './controller';

class PlannerRoutes {
  public router: Router;
  private PlannerDB: IMongoService;

  public constructor(db: MongoClient.Db) {
    this.router = Router();
    this.PlannerDB = mongoService(db)('planner');
    this.init();
  }

  private init() {
    this.router.get('/week/:from/:to', chainP([validateRange(this.PlannerDB), getPlannerByRange(this.PlannerDB)]))
    this.router.post('/week', chainP([validatePlanner(this.PlannerDB), saveWeekPlanner(this.PlannerDB)]));
    this.router.post('/day', chainP([savePlan(this.PlannerDB)]));
  }
}

export default PlannerRoutes;